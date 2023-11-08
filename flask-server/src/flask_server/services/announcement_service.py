from dateutil.parser._parser import ParserError
from flask import Blueprint, abort, request
from flask_server.classes.announcement import Announcement
from flask_server.global_config import db_client
from google.cloud import firestore
from werkzeug.exceptions import BadRequest, NotFound, Forbidden


announcement_service = Blueprint('announcement_service', __name__, template_folder='templates',
                          url_prefix='/announcement-service')


@announcement_service.route('', methods=['GET', 'POST'])
def _announcement_service():
    '''Perform CRUD operations on the Announcements collection in database'''
    # get announcements reference
    announcements_ref = db_client.announcements_collection

    if request.method == 'GET':
        # get all announcement documents ordered with descending creation date
        query = announcements_ref.order_by('timestamp', direction=firestore.Query.DESCENDING)
        announcements_list = [announcement_doc.to_dict() for announcement_doc in query.stream()]
        
        return announcements_list, 200
    elif request.method == 'POST':
        # create new announcement with timestamp
        data = request.json

        # create new doc ref and add doc id to data
        announcement_ref = announcements_ref.document()
        data['id'] = announcement_ref.id

        # check that all required fields exist and no extra fields exist
        try:
            announcement = Announcement.from_json(data)
            announcement_data = announcement.to_json()
        except (TypeError, ParserError) as error:
            abort(BadRequest.code)

        # set creation timestamp
        data['timestamp'] = firestore.SERVER_TIMESTAMP
        announcement_ref.set(data)
        announcement_data = announcement_ref.get().to_dict()

        return announcement_data, 201
