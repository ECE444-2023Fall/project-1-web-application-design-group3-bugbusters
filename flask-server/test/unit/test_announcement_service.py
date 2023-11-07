from flask_server.global_config import db_client
from flask_server import create_app
import pytest
import json


# Pytest fixture
@pytest.fixture
def test_client():
    app = create_app()
    app.config["TESTING"] = True
    client = app.test_client()
    db_client._testing = True
    yield client
    db_client._testing = False


def test_get_announcements(test_client):
    # call /announcement-service endpoint with GET request
    response = test_client.get('/announcement-service')
    
    # ensure the response status code is 200 (OK)
    assert response.status_code == 200


def test_valid_create_announcement(test_client):
    description = 'This is a test announcement!'
    test_announcement_json = {'description': description}

    # call /announcement-service endpoint with test announcement
    response = test_client.post('/announcement-service', json=test_announcement_json)

    # ensure the response status code is 201 (announcement successfully created)
    assert response.status_code == 201

    # parse the JSON response
    data = json.loads(response.data)

    # Check if the description key in the JSON response matches the expected value
    assert data.get('description') == description

    # Delete user profile
    docs = db_client.announcements_collection.where('description', '==', description).limit(1).stream()
    for doc in docs:
        doc.delete()

    # Check that user profile was deleted
    assert not db_client.announcements_collection.where('description', '==', description).get()
