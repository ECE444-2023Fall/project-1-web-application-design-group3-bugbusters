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
    ClassField("_images", lambda arg: EventImages.from_json(arg)),
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
        # self._expiry_time = ""
        return

    def from_json(self, json):

        required_keys = ['_event_id', '_creator_id', '_event_start_time', '_event_end_time', '_location']

        if json is None:
            # Error, no input
            return 1, None
        if not all(key in json for key in required_keys):
            # Error, bad input
            return 1, None

        for key, value in json.items():
            factory_func = getattr(EVENT_FIELDS, key)
            value = factory_func(value)
            setattr(self, key, value)

        return 0, self

    def to_json(self):
        if self is None:
            return 1, None
        
        event_json = {}

        for attr, value in vars(self).items():
            if value is not None:
                event_json[attr] = value

        return 0, event_json
    