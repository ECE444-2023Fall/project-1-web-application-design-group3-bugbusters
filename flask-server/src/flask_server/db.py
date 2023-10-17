import firebase_admin
from firebase_admin import credentials, firestore
import git
import os

# Authenticate credentials so we can access our firebase project
git_repo = git.Repo(os.getcwd(), search_parent_directories=True)
repo_root = git_repo.git.rev_parse("--show-toplevel")
json_path = "flask-server/ece444bulletin-firebase-adminsdk.json"
cred = credentials.Certificate(os.path.join(repo_root, json_path))
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
