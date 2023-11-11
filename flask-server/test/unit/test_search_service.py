from flask_server.classes.event import Event, EVENT_FIELDS
from flask_server.global_config import db_client
from flask_server.global_config import search_client
from flask_server import create_app
import pytest
import json

search_data = {"query": ""}
add_data = {"objectID": 'test_object', "_creator_id": "Test", "_event_title": "London Test Event", "_location": "Ontario", "_event_start_time": "2018-08-03T10:00:00.000", "_event_end_time": "2018-08-03T12:00:00.000"}
update_data = {}
delete_data = {'objectID': 'test_object'}

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

# test search
def test_search(test_client):
    response = test_client.post('/search-service/search', json=search_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data.get('nbHits', None) != None
    assert data.get('results', None) != None

# test add
def test_add(test_client):
    response = test_client.post('/search-service/add', json=add_data)
    assert response.status_code == 201

# test update
def test_update(test_client):
    required_keys = Event.required_keys
    data = {key: "TEST" for key in required_keys}
    data['_event_start_time'] = "2023-11-07T14:00:00-05:00"
    data['_event_end_time'] = "2023-11-08T14:00:00-05:00"
    response = test_client.post('/event-service/create-event', json=data)
    assert response.status_code == 201

    event_id = json.loads(response.data).get('event_id', None)
    assert event_id != None

    update_data['objectID'] = event_id
    update_data['_description'] = "TEST SUCCESSFUL DESCRIPTION"
    response = test_client.patch('/search-service/update', json=update_data)

    assert response.status_code == 200

# test delete
def test_delete(test_client):
    response = test_client.delete('/search-service/delete', json=delete_data)
    assert response.status_code == 200