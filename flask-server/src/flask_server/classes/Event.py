from flask_server.classes.event_images import EventImages
from flask_server.classes.common import ClassField, DataField

EVENT_FIELDS = DataField([
    ClassField("_event_id"),
    ClassField("_creator_id"),
    ClassField("_event_title"),
    ClassField("_description"),
    ClassField("_location"),
    ClassField("_event_start_time"),
    ClassField("_event_end_time"),
    ClassField("_images", lambda arg: EventImages.from_json(arg), lambda arg: arg.to_json()),
])
# Out of scope fields '_tags', '_flagged', '_rsvp_email_list'

class Event:
    """Event class"""
    def __init__(self, event_id, creator_id):
        self._event_id = event_id
        self._event_title = ""
        self._description = ""
        self._location = ""
        self._event_start_time = ""
        self._event_end_time = ""
        self._images = EventImages()

        self._creator_id = creator_id

        # out of scope for the time being
        # self._tags = []
        # self._flagged = False
        # self._rsvp_email_list = []

        return

    @classmethod
    def from_json(cls, json):
        if json is None:
            return None
        if '_event_id' not in json or '_creator_id' not in json: 
            return None
        
        event_id = json['_event_id']
        creator_id = json['_creator_id']
        event_instance = cls(event_id, creator_id)

        for key, value in json.items():
            factory_func = EVENT_FIELDS.factory_funcs(key)
            value = factory_func(value)
            setattr(event_instance, key, value)

        return event_instance

    def to_json(self):
        event_json = {}

        for event_field_name in EVENT_FIELDS:
            event_value = eval(f"self.{event_field_name}")
            if event_value is not None:
                json_factory_func = EVENT_FIELDS.json_factory_funcs(event_field_name)
                event_json[event_field_name] = json_factory_func(event_value)

        return event_json
