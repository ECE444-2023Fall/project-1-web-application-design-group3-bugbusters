from flask import Blueprint, abort, request, jsonify
from flask_server.global_config import db_client
from flask_server.classes.event import Event
from flask_server.global_config import search_client
from flask_server.services.user_service import getUserProfile
from google.cloud import firestore
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import uuid
import os

event_service = Blueprint('event_service', __name__, template_folder='templates',
                          url_prefix='/event-service')

def getEventHelper(event_id):
    event_doc_ref = db_client.events_collection.document(event_id)
    # Get the data of the event document
    event_data = event_doc_ref.get().to_dict()

    return event_data

@event_service.route('/<event_id>')
def getEvent(event_id):
    '''Given an event_id, return the corresponding event to it'''

    event_data = getEventHelper(event_id)

    if event_data is None:
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

def editEventHelper(event_obj):
    try:
        # Retrieve the json back from our obj
        event_data = event_obj.to_json()

        # Add the event data to the Firestore "Events" collection
        event_ref = db_client.events_collection.document(event_obj._event_id)

        event_ref.set(event_data)

        return True

    except:
        return False

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

    # call event edit helper
    if editEventHelper(event_obj):
        return {'message': 'Event edited successfully!', 'event_id': event_id}, 200

    return {'message': 'Event editing failed!', 'event_id': event_id}, 400


@event_service.route('/rsvp', methods=['POST'])
def rsvpSignup():
    data = request.json

    event_id = data["_event_id"]
    email = data["_email"]

    if event_id is None or email is None:
        return jsonify({'message': 'Error, no email or event id provided!'}), 400

    event_data = getEventHelper(event_id)

    if event_data is None:
       return jsonify({'message': 'Error, no event with matching event id!'}), 400

    event_obj = Event.from_json(event_data)

    if email in event_obj._rsvp_email_list:
        return jsonify({'message': 'Error, email already signed up!'}), 409

    event_obj._rsvp_email_list.append(email)

    if not editEventHelper(event_obj):
        return jsonify({'message': 'Error, could not update object!'}), 400

    return jsonify({'message': 'RSVP successful!'}), 200


@event_service.route('/rsvp-send', methods=['POST'])
def rsvpSend():
    data = request.json

    event_id = data["_event_id"]

    if event_id is None:
        return jsonify({'message': 'Error, bad event id!'}), 400

    event_data = getEventHelper(event_id)

    if event_data is None:
       return jsonify({'message': 'Error, no event!'}), 400

    event_obj = Event.from_json(event_data)

    # Check that an RSVP email has not been sent out already
    if event_obj._rsvp_sent is True:
        return jsonify({'message': 'RSVP alread sent'}), 409
    
    # Check there are emails on the RSVP  list
    if event_obj._rsvp_email_list is []:
        return jsonify({'message': 'RSVP list empty'}), 400

    # Email configuration
    sender_email = os.getenv('CLUBHUBEMAIL_USER')

    # 2FA passcode for gmail account
    sender_password = os.getenv('CLUBHUBEMAIL_PASSWORD')

    subject = "ClubHub: Friendly Event Reminder for " + event_obj._event_title

    # Your template string
    message = """
Dear ClubHub user,

We hope this message finds you well. We're excited to remind you about your upcoming event!

Event Details:
    Title: [Event Name]
    Date: [Event Date]
    Time: [Event Time]
    Location: [Event Venue]
    """

    # Parse the string into a datetime object
    parsed_datetime =event_obj._event_start_time

    formatted_time = parsed_datetime.strftime('%I:%M %p')  # %I for 12-hour, %p for AM/PM
    formatted_date = parsed_datetime.strftime('%Y-%m-%d')

    # Replace placeholders with actual variable values
    message = message.replace("[Event Name]", event_obj._event_title)
    message = message.replace("[Event Date]", formatted_date)
    message = message.replace("[Event Time]", formatted_time)
    message = message.replace("[Event Venue]", event_obj._location)

    # Connect to the SMTP server (in this case, Gmail's SMTP server)
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.ehlo()
            server.starttls()
            server.login(sender_email, sender_password)

            for receiver_email in event_obj._rsvp_email_list:

                # Create a message
                msg = MIMEMultipart()
                msg['From'] = sender_email
                msg['To'] = receiver_email
                msg['Subject'] = subject

                msg.attach(MIMEText(message, 'plain'))

                # Send the email
                text = msg.as_string()
                server.sendmail(sender_email, receiver_email, text)
            server.quit()

    except Exception:
        return jsonify({'message': 'RSVP email could not send!'}), 400

    event_obj._rsvp_sent = True

    if not editEventHelper(event_obj):
        return jsonify({'message': 'Error, could not update object!'}), 400

    return jsonify({'message': 'RSVP reminder sent successfully!'}), 200
