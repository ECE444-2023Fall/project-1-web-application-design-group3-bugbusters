from flask_server.classes.EventImages import EventImages

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

        if '_event_id' in json : event_instance._event_title = json['_event_title']
        if '_description' in json : event_instance._description = json['_description']
        if '_location' in json : event_instance._location = json['_location']
        if '_event_start_time' in json : event_instance._event_start_time = json['_event_start_time']
        if '_event_end_time' in json : event_instance._event_end_time = json['_event_end_time']
        if '_images' in json : event_instance._images = EventImages.from_json(json['_images'])
        if '_creator_id' in json : event_instance._creator_id = json['_creator_id']

        # # out of scope for the time being
        # if '_tags' in json : event_instance._tags = json['_tags']
        # if '_flagged' in json : event_instance._flagged = json['_flagged']
        # if '_rsvp_email_list' in json : event_instance._rsvp_email_list = json['_rsvp_email_list']

        return event_instance
