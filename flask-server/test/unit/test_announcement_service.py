from flask_server.global_config import db_client
from flask_server import create_app
import pytest
import json


description = 'This is a test announcement!'
test_announcement_json = {'description': description}
updated_description = 'This is an updated announcement'
test_updated_announcement_json = {'description': updated_description}
query = {'id': '30x68LnKICDyaQMnZgzT'}

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
    # call /announcement-service endpoint with test announcement
    response = test_client.post('/announcement-service', json=test_announcement_json)

    # ensure the response status code is 201 (announcement successfully created)
    assert response.status_code == 201

    # parse the JSON response
    data = json.loads(response.data)

    # check if the description key in the JSON response matches the expected value
    assert data.get('description') == description

    # get doc id
    id = data.get('id')
    assert id is not None

    # delete user profile
    db_client.announcements_collection.document(id).delete()

    # check that user profile was deleted
    assert not db_client.announcements_collection.document(id).get().exists


@pytest.mark.parametrize('input_json, query_string, expected_code',
                         [(test_updated_announcement_json, query, 204),
                          (test_updated_announcement_json, {}, 400),
                          ({}, query, 400),
                          (test_updated_announcement_json, {'id': '123'}, 404)])
def test_valid_edit_announcement(test_client, input_json, query_string, expected_code):
    # call /announcement-service endpoint with PUT request to edit
    response = test_client.put('/announcement-service', json=input_json,
                               query_string=query_string)

    # ensure the response status code is equal to expected code
    assert response.status_code == expected_code

    # reset description if request was successful
    if response.status_code == 204:
        db_client.announcements_collection.document(query_string['id']).update({'description': description})


@pytest.mark.parametrize('query_string, expected_code',
                         [(query, 204),
                          ({}, 400),
                          ({'id': 'NOT REAL ID BUT WILL STILL 204'}, 204)])
def test_valid_delete_announcement(test_client, query_string, expected_code):
    id = query_string.get('id')
    # store document data for resetting
    doc_ref = db_client.announcements_collection.document(id).get()
    reset_flag = False
    if doc_ref.exists:
        reset_flag = True
        doc_data = doc_ref.to_dict()

    # call /announcement-service endpoint with DELETE request to delete
    response = test_client.delete('/announcement-service', query_string=query_string)

    # ensure the response status code is equal to the expected code
    assert response.status_code == expected_code

    # check document was deleted if request was successful
    if response.status_code == 204:
        assert not db_client.announcements_collection.document(id).get().exists
        if reset_flag:
            db_client.announcements_collection.document(id).set(doc_data)
