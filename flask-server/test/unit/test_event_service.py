from flask_server.classes.event import Event, EVENT_FIELDS
from flask_server.global_config import db_client
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
    yield client
    db_client._testing = False

# Lab 5 - Ben Goel Unit Test 
def test_valid_get_event(test_client):
    # call /event-service/<event_id> endpoint with test event ID
    response = test_client.get("/event-service/761bb946-1445-4f61-a1fd-d61411e0a336")
    
    # ensure the response status code is 200 (OK)
    assert response.status_code == 200
    
    # parse the JSON response
    data = json.loads(response.data)

    # Check if the 'event_id' key in the JSON response matches the expected value
    assert data.get('_event_id') == "761bb946-1445-4f61-a1fd-d61411e0a336"

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
    required_keys = Event.required_keys
    data = {key: "TEST" for key in required_keys}
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

def test_event_rsvp(test_client):
    #"761bb946-1445-4f61-a1fd-d61411e0a336"
    event_id =  'fc48bf4d-6445-47ec-bbb6-67cc29397295'
    email = 'some_email@mail.utoronto.ca'

    # response = test_client.get("/event-service/"+event_id)
    
    # # ensure the response status code is 200 (OK)
    # assert response.status_code == 200

    # # parse the JSON response
    # data = json.loads(response.data)

    data = {}

    data["_event_id"] = event_id
    data["_email"] = email
    print(data)
    response = test_client.post('/event-service/rsvp', json=data)
    print(response)

    assert response.status_code == 200

    response2 = test_client.get("/event-service/"+event_id)

    assert response2.status_code == 200

    modifiedEventDict = json.loads(response2.data)

    # db_client.events_collection.document(event_id).get().to_dict()

    assert modifiedEventDict['_rsvp_email_list'].contains(email)

    # modifiedEventObj = Event.from_json(modifiedEventDict)

    # modifiedEventObj._rsvp_email_list = []

    # modifiedEventObj

    modifiedEventDict['_rsvp_email_list'] = []

    response = test_client.put('/event-service/edit-event/' + event_id, json=modifiedEventDict)

    assert response == 200
