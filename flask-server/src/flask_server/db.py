from flask_server.classes.DataBaseClient import DataBaseClient

# Specify path of authenticate credentials here
# auth_path = "/Users/bengoel/Documents/clubhub/flask-server/ece444bulletin-firebase-adminsdk.json"
auth_path = "/Users/mskre/OneDrive/Desktop/Y4/Y4S1/ECE444/Project 1/Code_Base/auth_key.json"
db_client = DataBaseClient(auth_path)
