from flask import Blueprint, abort
from flask_server.db import db_client

event_service = Blueprint('event_service', __name__, template_folder='templates')

@event_service.route('/event_service/<event_id>')
def getEvent(event_id):
    '''Given an event_id, return the corresponding event to it'''
    event_doc_ref = db_client._events_collection.document(event_id)
    # Get the data of the event document
    event_data = event_doc_ref.get().to_dict()

    if not event_data:
        print(f"No event found with ID: {event_id}")
        abort(404, None)

    return event_data

@event_service.route('/event_service/')
def getAllEvents():
    '''No inputs, returns all events in the events collection within the database'''
    # Get colleciton reference
    event_ref = db_client._events_collection

    # Get the data of each event document
    event_data_list = [event_doc.to_dict() for event_doc in event_ref.stream()]

    return event_data_list