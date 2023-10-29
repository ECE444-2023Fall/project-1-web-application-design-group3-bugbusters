from flask_server.classes.event import Event, EVENT_FIELDS
from flask_server.global_config import db_client
from flask_server import create_app
import pytest
import json

# Pytest fixture
@pytest.fixture
def test_client():
    # Here event_service is the flask app itself, imported from event_service.py
    app = create_app()
    app.config["TESTING"] = True
    client = app.test_client()
    db_client._testing = True
    yield client
    db_client._testing = False

# Lab 5 - Ben Goel Unit Test 
def test_valid_get_event(test_client):
    # call /event-service/<event_id> endpoint with test event ID
    response = test_client.get("/event-service/79h6hq5oW7lVX8gPwuXM")
    
    # ensure the response status code is 200 (OK)
    assert response.status_code == 200
    
    # parse the JSON response
    data = json.loads(response.data)

    # Check if the 'event_id' key in the JSON response matches the expected value
    assert data.get('_event_id') == "79h6hq5oW7lVX8gPwuXM"

# Lab 5 - Ata Unit Test 
def test_invalid_get_event(test_client):
    response = test_client.get("bad_id")
    
    # Check if the response status code is 404 (FAIL/Does not exist)
    assert response.status_code == 404

# Lab 5 - Chris Unit Test 
def test_get_all_events(test_client):
    event_size = len(list(db_client.events_collection.stream()))
    event_json_response = test_client.get('/event-service/')
    events = []
    print("response")
    print(event_json_response.status_code)
    print("data")
    print(json.loads(event_json_response.data))

    for event_json in json.loads(event_json_response.data):
        event = Event.from_json(event_json)
        if event:
            events.append(event)
        else:
            event_size -= 1

    # Test failed: getAllEvents query returned no events
    assert(events != None and event_size != 0)

    # Test failed: getAllEvents query did not return all events
    assert(event_size == len(events))

    return

# Lab 5 - Ali Unit Test
def test_create_event(test_client):
    # required_keys = ['_event_id', '_creator_id', '_event_start_time', '_event_end_time', '_location']
    required_keys = Event.required_keys
    data = {key: "TEST" for key in required_keys}
    response = test_client.post('/event-service/create-event', json=data)
    assert response.status_code == 201
    
    return
