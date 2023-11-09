from flask import Blueprint, abort, request, jsonify
from flask_server.global_config import db_client
from flask_server.classes.event import Event
from flask_server.global_config import search_client
from flask_server.services.user_service import getUserProfile
from google.cloud import firestore
import uuid

event_service = Blueprint('event_service', __name__, template_folder='templates',
                          url_prefix='/event-service')

@event_service.route('/<event_id>')
def getEvent(event_id):
    '''Given an event_id, return the corresponding event to it'''

    event_doc_ref = db_client.events_collection.document(event_id)
    # Get the data of the event document
    event_data = event_doc_ref.get().to_dict()

    if not event_data:
        print(f"No event found with ID: {event_id}")
        abort(404, None)

    return event_data, 200

@event_service.route('/')
def getAllEvents():
    '''No inputs, returns all events in the events collection within the database'''

    # Get colleciton reference
    event_ref = db_client.events_collection

    # Get the data of each event document
    event_data_list = [event_doc.to_dict() for event_doc in event_ref.stream()]

    return event_data_list, 200

@event_service.route('/create-event', methods=['POST'])
def createEvent():
    data = request.json

    # Generate a unique event ID TODO: Is this an efficient way of checking the uuid doesn't exist?
    event_id = str(uuid.uuid4())
    while db_client.events_collection.document(event_id).get().exists:
        event_id = str(uuid.uuid4())

    # Insert the generated event_id into the input json / data
    data['_event_id'] = event_id

    # Fetch friendly creator name and add the object to the search index
    friendly_name = getUserProfile(data['_creator_id'])[0]['display_name']
    search_data = data.copy()
    search_data['_friendly_creator_name'] = friendly_name
    search_client.add_to_index(search_data['_event_id'], search_data)

    try:
        event_obj = Event.from_json(data)
    except KeyError as key_error:
        return {'message': 'Error, bad input!'}, 400

    # Retrieve the json back from our obj
    event_data = event_obj.to_json()
    event_data['TIMESTAMP'] = firestore.SERVER_TIMESTAMP

    # Add the event data to the Firestore "Events" collection
    event_ref = db_client.events_collection.document(event_id)
    event_ref.set(event_data)

    return {'message': 'Event created successfully!', 'event_id': event_id}, 201

@event_service.route('/edit-event/<event_id>', methods=['PUT'])
def editEvent(event_id):
    data = request.json

    data['_event_id'] = event_id

    # edit event in search index
    search_client.update_index(data['_event_id'], data)

    try:
        event_obj = Event.from_json(data)
    except KeyError as key_error:
        return {'message': 'Error, bad input!'}, 400

    # Retrieve the json back from our obj
    event_data = event_obj.to_json()

    # Add the event data to the Firestore "Events" collection
    event_ref = db_client.events_collection.document(event_id)
    event_ref.set(event_data)

    return {'message': 'Event edited successfully!', 'event_id': event_id}, 200
