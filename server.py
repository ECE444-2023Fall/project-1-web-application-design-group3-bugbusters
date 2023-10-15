import firebase_admin
from firebase_admin import credentials, firestore

# Authenticate credentials so we can access our firebase project
cred = credentials.Certificate("./ece444bulletin-firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore db
db = firestore.client()

def get_all_events():
    # Get events collection
    events_ref = db.collection("Events")
    # Get all the individual events
    event_docs = events_ref.stream()
    # Print their ids
    for doc in event_docs:
        print(f"Document ID: {doc.id}")
    

if __name__ == "__main__":
    get_all_events()