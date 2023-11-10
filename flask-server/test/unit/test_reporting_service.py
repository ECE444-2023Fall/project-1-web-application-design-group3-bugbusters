from flask_server.classes.event import Event, EVENT_FIELDS
from flask_server.global_config import db_client
from flask_server.global_config import search_client
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
    search_client.set_testing(True)
    yield client
    db_client._testing = False

# test search
def test_report(test_client):
    report_response = test_client.post('/report-service/report/eac11422-6757-4c01-ad39-f8264cd17dce', json = {'report': True})
    assert report_response.status_code == 200