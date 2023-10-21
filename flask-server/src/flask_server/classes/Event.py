from flask_server.classes.EventImages import EventImages

EVENT_FIELDS = ["_event_id", "_creator_id", "_event_title", "_description", "_location", "_event_start_time", "_event_end_time", "_images",]
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
            if key == "_images":
                event_instance._images = EventImages.from_json(json['_images'])

            if key in EVENT_FIELDS:
                setattr(event_instance, key, value)
                
        return event_instance