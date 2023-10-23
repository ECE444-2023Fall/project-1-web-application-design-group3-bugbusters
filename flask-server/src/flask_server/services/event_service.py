from flask import Blueprint, abort, request, jsonify
from flask_server.db import db_client
import uuid

event_service = Blueprint('event_service', __name__, template_folder='templates',
                          url_prefix='/event-service')

@event_service.route('/<event_id>')
def getEvent(event_id):
    '''Given an event_id, return the corresponding event to it'''

    event_doc_ref = db_client._events_collection.document(event_id)
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
    event_ref = db_client._events_collection

    # Get the data of each event document
    event_data_list = [event_doc.to_dict() for event_doc in event_ref.stream()]

    return event_data_list, 200

@event_service.route('/create_event', methods=['POST'])
def createEvent():
    try:
        data = request.json
        # TODO: Error check that data types are as expected?
        
        # Generate a unique event ID TODO: Is this an efficient way of checking the uuid doesn't exist?
        event_id = str(uuid.uuid4())
        while db_client._events_collection.document(event_id).get().exists:
            event_id = str(uuid.uuid4())

        # Extracting event data from the request json
        event_data = {
            '_creator_id': data.get('_creator_id'),
            '_description': data.get('_description'),
            '_event_end_time': data.get('_event_end_time'),
            '_event_id': event_id,  # Use the generated event ID
            '_event_start_time': data.get('_event_start_time'),
            '_event_title': data.get('_event_title'),
            '_images': {
                '_header_image': data['_images']['_header_image'],
                '_image_gallery': data['_images']['_image_gallery'],
                '_profile_image': data['_images']['_profile_image']
            },
            '_location': data.get('_location'),
            '_event_expirt_time': data.get('_expiry_time')
        }

        # Add the event data to the Firestore "Events" collection
        event_ref = db_client._events_collection.document(event_id)
        event_ref.set(event_data)

        return jsonify({'message': 'Event created successfully!', 'event_id': event_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400