from src.flask_server.classes.Event import Event, EVENT_FIELDS
from src.flask_server.services.event_service import event_service, getEvent, getAllEvents
from src.flask_server.global_config import db_client
import pytest
import json

# Pytest fixture
@pytest.fixture
def test_client():
    # Here event_service is the flask app itself, imported from event_service.py
    event_service.config["TESTING"] = True
    return event_service.test_client()

def test_valid_get_event(test_client):
    response = test_client.get("/DttWcIu4XOe5vdskk79v")
    
    # Check if the response status code is 200 (OK)
    assert response.status_code == 200
    
    # Parse the JSON response
    data = json.loads(response.data)

    # Check if the 'event_id' key in the JSON response matches the expected value
    assert data.get('event_id') == "DttWcIu4XOe5vdskk79v"

def test_invalid_get_event(test_client):
    response = test_client.get("bad_id")
    
    # Check if the response status code is 404 (FAIL/Does not exist)
    assert response.status_code == 404


# This test will likely need to be re-written
def test_get_all_events(test_client):
        event_size = len(list(db_client._events_collection.stream()))
        event_json = test_client.get('/')
        events = []
        for json in event_json:
            event = Event.from_json(json) 
            if event:
                events.append(event)
            else:
                event_size -= 1

        # Test failed: getAllEvents query returned no events
        assert(events != None and event_size != 0)

        # Test failed: getAllEvents query did not return all events
        assert(event_size == len(events))
    