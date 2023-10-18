import flask
from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
from flask_server.db import db_client

event_service = Blueprint('event_service', __name__, template_folder='templates')

@event_service.route('/event_service/<event_id>')
def getEvent(event_id):
    '''Given an event_id, return the corresponding event to it'''
    try:
        event_doc_ref = db_client._events_collection.document(event_id)
        # Get the data of the event document
        event_data = event_doc_ref.get().to_dict()

        if not event_data:
            print(f"No event found with ID: {event_id}")

        return event_data
    
    except TemplateNotFound:
        abort(404)

@event_service.route('/event_service/')
def getAllEvents():
    '''No inputs, returns all events in the events collection within the database'''
    try:
        # Get colleciton reference
        event_ref = db_client._events_collection

        # Get the data of each event document
        event_data_list = [event_doc.to_dict() for event_doc in event_ref.stream()]

        if not event_data_list:
            print(f"No events")

        return event_data_list
    except TemplateNotFound:
        abort(404)