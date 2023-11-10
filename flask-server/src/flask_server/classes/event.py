from flask_server.classes.event_images import EventImages
from flask_server.classes.common import ClassField, DataField
import datetime
from dateutil import parser
import pytz
from proto.datetime_helpers import DatetimeWithNanoseconds

def event_time_factory(time_string):
#    # Parse the string to a datetime object with dateutil
#    # Sample expected input: "2023-11-07T14:00:00-05:00"
    try:
        # If the input is a datetime string this will pass
        return parser.isoparse(time_string)
    except:
        # If it fails then just return the datetime object
        return time_string

EVENT_FIELDS = DataField([
    ClassField("_event_id"),
    ClassField("_creator_id"),
    ClassField("_event_title"),
    ClassField("_description"),
    ClassField("_location"),
    ClassField("_event_start_time", event_time_factory, lambda arg: arg.isoformat()),
    ClassField("_event_end_time", event_time_factory, lambda arg: arg.isoformat()),
    ClassField("_images", lambda arg: EventImages.from_json(arg), lambda arg: arg.to_json()),
    ClassField("_rsvp_email_list"),
    ClassField("_rsvp_sent"),
    ClassField("_flagged"),
    ClassField("_event_expiry_time", event_time_factory)
])
    

# Out of scope fields '_tags'

class Event:
    """Event class"""

    required_keys = ['_event_id', '_creator_id', '_event_title', '_location', '_event_start_time', '_event_end_time']

    def __init__(self, event_id, creator_id):
        toronto_tz = pytz.timezone('America/Toronto')
        current_time_toronto = datetime.datetime.now(toronto_tz)
        self._event_id = event_id
        self._creator_id = creator_id
        self._event_title = ""
        self._description = ""
        self._location = ""
        self._event_start_time = ""
        self._event_end_time = ""
        self._images = EventImages()
        self._rsvp_email_list = []
        self._rsvp_sent = False
        self._flagged = False
        self._event_expiry_time = current_time_toronto

        


        # out of scope for the time being
        # self._tags = []
        
        return

    @classmethod
    def from_json(cls, json):
        if not all(key in json for key in cls.required_keys):
            # Error, bad input
            raise KeyError("Bad Input")
        
        useDefaultExpiry = '_event_expiry_time' not in json        
        
        event_instance = Event(json['_event_id'], json['_creator_id'])

        for key, value in json.items():
            if key == 'TIMESTAMP':
                continue
            factory_func = EVENT_FIELDS.factory_funcs(key)
            value = factory_func(value)
            setattr(event_instance, key, value)
            if useDefaultExpiry and key == '_event_end_time':
                setattr(event_instance, '_event_expiry_time', value + datetime.timedelta(hours=24))
        
        return event_instance

    def to_json(self):
        event_json = {}

        for event_field_name in EVENT_FIELDS:
            event_value = eval(f"self.{event_field_name}")
            if event_value is not None:
                json_factory_func = EVENT_FIELDS.json_factory_funcs(event_field_name) # How to define factory func for event_x_time fields (convert python obj to time string)
                event_json[event_field_name] = json_factory_func(event_value)

        return event_json
