import pytest
from flask_server import create_app
from flask_server.classes.Event import Event, EVENT_FIELDS

sample_event_json = {'_event_title': 'SKULE Band Meeting', '_event_id': 'DttWcIu4XOe5vdskk79v', '_images': {'_profile_image': 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FSKULE.jpg?alt=media&token=6f6161fc-e3d5-46ad-a20c-855047ff66d0&_gl=1*1mu6xm5*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzcyODMyMC4xMi4xLjE2OTc3MjgzMzguNDIuMC4w', '_image_gallery': ['https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FBNAD.jfif?alt=media&token=974ff480-9132-4ae7-9ead-6803eb9b9e9e&_gl=1*om634*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxOTEuNTUuMC4w', 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2Ffront_campus.jpeg?alt=media&token=d176f235-ee09-4e11-978b-624247b4d425&_gl=1*1uvnzpb*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxODYuNjAuMC4w'], '_header_image': 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FSKULE.jpg?alt=media&token=6f6161fc-e3d5-46ad-a20c-855047ff66d0&_gl=1*ak4s2r*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxOTUuNTEuMC4w'}, '_location': 'Stanford Flemming', '_creator_id': 'rgLV0SQuAa0QPAXH9wl7', '_event_start_time': '2023-10-17 12:23:33.361628', '_description': 'Testing event functionality with multiple events', '_event_end_time': '2023-10-17 12:23:33.361628'}

@pytest.fixture
def good_event_obj():
    # Setup 
    event_obj = Event(sample_event_json['_event_id'], sample_event_json['_creator_id'])

    for key, value in sample_event_json.items():
        factory_func = getattr(EVENT_FIELDS, key)
        value = factory_func(value)
        setattr(event_obj, key, value)
    return event_obj

@pytest.fixture
def bad_event_obj():
    return Event(None, "") # Missing key values like the event id 

@pytest.fixture
def good_event_json():
    return sample_event_json

@pytest.fixture
def bad_event_json():
    return {'_event_title': 'Bad event'} # Missing creator id, location, etc.

# Lab 5 - Elliot P-K Unit Test 
def test_valid_to_json(good_event_obj):
    # Testing
    new_event_json = good_event_obj.to_json()

    # Validation
    for key, value in new_event_json.items():
        # Test failed: incorrect information in transformation
        if value == [] or value == "":
            assert(sample_event_json[key] is "" or sample_event_json[key] == [])
            continue
        assert(value == sample_event_json[key])

def test_invalid_to_json(bad_event_obj):
    return

def test_valid_from_json(good_event_json):
    return

def test_invalid_from_json(good_event_json):
    return