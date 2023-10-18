import firebase_admin
from firebase_admin import credentials, firestore

class DataBaseClient:
    """DataBaseClient class"""

    def __init__(self, auth_path):
        # Authenticate credentials so we can access our firebase project
        cred = credentials.Certificate(auth_path)
        firebase_admin.initialize_app(cred)

        # Initialize Firestore db
        self._db = firestore.client()

        self._events_collection = self._db.collection("Events")
        self._users_collection = self._db.collection("Users")

        return
    