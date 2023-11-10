import pytest
from flask_server import create_app
from flask_server.classes.event import Event, EVENT_FIELDS

# Lab 5 - Elliot P-K Unit Test 
def test_serialize_event():

    # Setup 
    original_event_json = {'_event_title': 'SKULE Band Meeting', '_event_id': 'DttWcIu4XOe5vdskk79v', '_images': {'_profile_image': 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FSKULE.jpg?alt=media&token=6f6161fc-e3d5-46ad-a20c-855047ff66d0&_gl=1*1mu6xm5*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzcyODMyMC4xMi4xLjE2OTc3MjgzMzguNDIuMC4w', '_image_gallery': ['https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FBNAD.jfif?alt=media&token=974ff480-9132-4ae7-9ead-6803eb9b9e9e&_gl=1*om634*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxOTEuNTUuMC4w', 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2Ffront_campus.jpeg?alt=media&token=d176f235-ee09-4e11-978b-624247b4d425&_gl=1*1uvnzpb*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxODYuNjAuMC4w'], '_header_image': 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FSKULE.jpg?alt=media&token=6f6161fc-e3d5-46ad-a20c-855047ff66d0&_gl=1*ak4s2r*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxOTUuNTEuMC4w'}, '_location': 'Stanford Flemming', '_creator_id': 'rgLV0SQuAa0QPAXH9wl7', '_event_start_time': '2023-10-17T12:23:33.361628', '_description': 'Testing event functionality with multiple events', '_event_end_time': '2023-10-17T12:23:33.361628',  '_rsvp_email_list': ['some_student@mail.utoronto.ca', 'some_other_student@mail.utoronto.ca'], '_rsvp_sent':False, '_flagged':False}
    event = Event.from_json(original_event_json)
    
    # Validation for from_json
    for key, value in original_event_json.items():
        # Test failed: incorrect information in transformation
        if not hasattr(event, key):
            raise KeyError()
    
    # At this point from_json worked

    # Testing
    new_event_json = event.to_json()

    # Validation
    for key, value in new_event_json.items():
        if key not in original_event_json:
            continue
        # Test failed: incorrect information in transformation
        if value == [] or value == "":
            assert(original_event_json[key] is "" or original_event_json[key] == [])
            continue
        assert(value == original_event_json[key])
    return
