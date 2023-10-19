from flask_server.db import db_client

if __name__ == "__main__":
    # Get events collection
    events_ref = db_client._events_collection

    # customize data to upload
    # NOTE: you will have to manually change the event_id in the database because it is initialized when we add
    data_to_upload = {
    "_event_id" : "xLbcR6Ok5mZiRiRvfGYB",
    "_event_title" : "Test Event 2",
    "_description" : "Testing event functionality with multiple events",
    "_location" : "Stanford Flemming",
    "_event_start_time" : "2023-10-17 12:23:33.361628",
    "_event_end_time" : "2023-10-17 12:23:33.361628",
    "_images" : {
        "_header_image" : "header_image_url",
        "_profile_image" : "rgLV0SQuAa0QPAXH9wl7",
        "_image_gallery" : ["image_1_url", "image_2_url"]
    },
    "_creator_id" : "rgLV0SQuAa0QPAXH9wl7",
    }
    
    new_doc_ref = events_ref.add(data_to_upload)