from flask_server.classes.Event import Event
from flask_server.classes.User import User

class EventPackage:
    """Event Package class"""

    def __init__(self, event, creator):
        self._event = event
        self._creator = creator
        return
    