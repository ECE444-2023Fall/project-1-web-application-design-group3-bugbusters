from flask_server.classes.user_profile import UserProfile, USER_PROFILE_FIELDS
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


def test_valid_get_user_profile(test_client):
    # call /user-service/<uid> endpoint with test uid ID
    response = test_client.get("/user-service/213j124b346k5j6klvv2")
    
    # ensure the response status code is 200 (OK)
    assert response.status_code == 200
    
    # parse the JSON response
    data = json.loads(response.data)

    # Check if the 'uid' key in the JSON response matches the expected value
    assert data.get('uid') == "213j124b346k5j6klvv2"


def test_valid_create_user_profile(test_client):
    uid = 'CwEtKo8TIoch7ThjSra5PRklFr63'
    test_profile_json = {'display_name': 'Ben Goel', 'email': 'benjamin.goel@mail.utoronto.ca', 'uid': uid,
                         'photo_url': 'http://testtesttest.jpg', 'is_admin': False}

    # call /user-service/create-profile endpoint with test uid ID
    response = test_client.post("/user-service/create-profile", json=test_profile_json)
    
    # ensure the response status code is 201 (user profile successfully created)
    assert response.status_code == 201
    
    # parse the JSON response
    data = json.loads(response.data)

    # Check if the 'uid' key in the JSON response matches the expected value
    assert data.get('uid') == uid

    # Delete user profile
    db_client.user_profiles_collection.document(uid).delete()

    # Check that user profile was deleted
    assert not db_client.user_profiles_collection.document(uid).get().exists
