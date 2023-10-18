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
        self._tags = []
        self._flagged = False
        self._rsvp_email_list = []

        return
    