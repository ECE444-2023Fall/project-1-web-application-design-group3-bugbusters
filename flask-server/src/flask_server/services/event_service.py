from flask import Blueprint, abort, request, jsonify
from flask_server.global_config import db_client
from flask_server.classes.Event import Event
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

    return jsonify(event_data), 200

@event_service.route('/')
def getAllEvents():
    '''No inputs, returns all events in the events collection within the database'''

    # Get colleciton reference
    event_ref = db_client._events_collection

    # Get the data of each event document
    event_data_list = [event_doc.to_dict() for event_doc in event_ref.stream()]

    return jsonify(event_data_list), 200

@event_service.route('/create_event', methods=['POST'])
def createEvent():
    try:
        data = request.json

        # Generate a unique event ID TODO: Is this an efficient way of checking the uuid doesn't exist?
        event_id = str(uuid.uuid4())
        while db_client._events_collection.document(event_id).get().exists:
            event_id = str(uuid.uuid4())
        
        # Get the creator id from the request
        creator_id = data.get('_creator_id')
        if creator_id is None or creator_id == "":
            return jsonify({'message': "Bad creator id"}), 422

        # Create the event object
        event_obj = Event(event_id, creator_id)
        
        # Extract the rest of the json data
        error_code, event_obj = event_obj.from_json(data)
        if error_code == 1:
            return jsonify({'message': 'Error, bad input!'}), 400

        # Retrieve the json back from our obj
        error_code, event_data = event_obj.to_json()

        # Add the event data to the Firestore "Events" collection
        event_ref = db_client._events_collection.document(event_id)
        event_ref.set(event_data)

        return jsonify({'message': 'Event created successfully!', 'event_id': event_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400