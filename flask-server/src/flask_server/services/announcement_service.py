from flask import Blueprint, abort, request
from flask_server.classes.user_profile import UserProfile
from flask_server.global_config import db_client
from google.cloud import firestore
from werkzeug.exceptions import BadRequest, NotFound, Forbidden


announcement_service = Blueprint('announcement_service', __name__, template_folder='templates',
                          url_prefix='/announcement-service')


@announcement_service.route('', methods=['GET'])
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
        return {"data": "JOE MAMA"}, 200
