from flask_server.classes.event import Event, EVENT_FIELDS
from flask_server.global_config import db_client
from flask_server.global_config import search_client
from flask_server import create_app
import random
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
    search_client.set_testing(True)
    yield client
    db_client._testing = False

# Lab 5 - Ben Goel Unit Test 
def test_valid_get_event(test_client):
    event_id = "fc48bf4d-6445-47ec-bbb6-67cc29397295"
    # call /event-service/<event_id> endpoint with test event ID
    response = test_client.get("/event-service/"+event_id)
    
    # ensure the response status code is 200 (OK)
    assert response.status_code == 200
    
    # parse the JSON response
    data = json.loads(response.data)

    # Check if the 'event_id' key in the JSON response matches the expected value
    assert data.get('_event_id') == event_id

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
    required_keys = Event.required_keys
    data = {key: "TEST" for key in required_keys}
    data['_creator_id'] = "213j124b346k5j6klvv2"
    data['_event_start_time'] = "2023-11-07T14:00:00-05:00"
    data['_event_end_time'] = "2023-11-08T14:00:00-05:00"
    response = test_client.post('/event-service/create-event', json=data)
    assert response.status_code == 201
    
    return

def test_edit_event(test_client):
    # Create what the modified obj should look like
    required_keys = Event.required_keys
    data = {key: "TEST" for key in required_keys}
    randomDescription = random.choice(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"])
    data['_event_start_time'] = "2023-11-07T14:00:00-05:00"
    data['_event_end_time'] = "2023-11-08T14:00:00-05:00"
    data['_description'] = randomDescription

    # Modify the event object
    response = test_client.put('/event-service/edit-event/fc48bf4d-6445-47ec-bbb6-67cc29397295', json=data)
    
    # Confirm the obj has been modified correctly
    assert response.status_code == 200
    modifiedEventObj = db_client.events_collection.document("fc48bf4d-6445-47ec-bbb6-67cc29397295").get().to_dict()
    assert modifiedEventObj['_description'] == randomDescription

    # Reset the description / obj
    data['_description'] = "resetValue"
    response = test_client.put('/event-service/edit-event/fc48bf4d-6445-47ec-bbb6-67cc29397295', json=data)
    
    return


def test_delete_event(test_client):
    required_keys = Event.required_keys
    data = {key: "TEST" for key in required_keys}
    id = "test-id-to-be-deleted" 
    data['_creator_id'] = id
    data['_event_start_time'] = "2023-11-07T14:00:00-05:00"
    data['_event_end_time'] = "2023-11-08T14:00:00-05:00"

    # get events collection ref
    events_ref = db_client.events_collection

    # create test document
    events_ref.document(id).set(data)

    # call event-service/delete-event/<event_id>
    response = test_client.delete(f'/event-service/delete-event/{id}')

    assert response.status_code == 204

    # make sure event was deleted
    assert not events_ref.document(id).get().exists


def test_event_rsvp(test_client):
    event_id =  'fc48bf4d-6445-47ec-bbb6-67cc29397295'
    email = 'some_email@mail.utoronto.ca'

    data = {}
    data["_event_id"] = event_id
    data["_email"] = email

    # Add email to RSVP list
    response = test_client.put('/event-service/rsvp', json=data)

    # Check return code and get the event which we just changed
    assert response.status_code == 200

    # try signing up again, and assert that the endpoint respnsed accordingly
    response = test_client.put('/event-service/rsvp', json=data)
    assert response.status_code == 409

    # Now lets send an rsvp email to this new signed up user
    data = {}
    data["_event_id"] = event_id

    response = test_client.post('/event-service/rsvp-send', json=data)
    assert response.status_code == 200

    # Find this event document and ensure that the email has been signed up
    # and the rsvp has been sent
    response = test_client.get("/event-service/"+event_id)
    assert response.status_code == 200

    modifiedEventDict = json.loads(response.data)

    # Assert this event has been modified and contains the email and has sent the rsvp
    assert email in modifiedEventDict['_rsvp_email_list']
    assert modifiedEventDict['_rsvp_sent'] == True

    # reset the email field and rsvp sent field
    modifiedEventDict['_rsvp_email_list'] = []
    modifiedEventDict['_rsvp_sent'] = False

    # Edit event with no rsvp emails and ensure the endpoint succeeded
    response = test_client.put('/event-service/edit-event/' + event_id, json=modifiedEventDict)
    assert response.status_code == 200

