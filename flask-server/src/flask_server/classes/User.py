# from flask_server.db import db_client

class User:
    def __init__(self, user_id):

        # initialize with an empty object except the user id
        self._user_id = user_id
        self._friendly_id = ""

        # If we want to grab all the user info in this file we can use the code below
        # # Access all user ids
        # user_ref = db_client.collection("Users")

        # # Use creator id to find user data
        # user_ref.documents(user_id)

        # # Get the data of the event document
        # user_data = user_ref.get().to_dict()

        # if user_data:
        #     # Do something with the event data
        #     print("Event Data:", user_data)
        # else:
        #     print(f"No event found with ID: {user_id}")

        # self._friendly_id = user_data.friendly_id
        return