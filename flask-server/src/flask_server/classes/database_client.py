import firebase_admin
from firebase_admin import credentials, firestore

class DataBaseClient:
    """DataBaseClient class"""

    def __init__(self, auth_path, testing = False):
        # Authenticate credentials so we can access our firebase project
        cred = credentials.Certificate(auth_path)
        firebase_admin.initialize_app(cred)

        # Initialize Firestore db
        self._db = firestore.client()
        self._testing = testing
        
        return

    @property
    def events_collection(self):
        if self._testing:
            return self._db.collection("TestEvents")
        else:
            return self._db.collection("Events")
    
    @property
    def users_collection(self):
        if self._testing:
            return self._db.collection("TestUsers")
        else:
            return self._db.collection("Users")