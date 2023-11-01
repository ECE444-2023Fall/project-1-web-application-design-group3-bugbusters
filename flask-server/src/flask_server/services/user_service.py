from flask import Blueprint, abort, request
from flask_server.global_config import db_client
from google.cloud.firestore_v1.base_query import FieldFilter
from werkzeug.exceptions import NotFound


user_service = Blueprint('user_service', __name__, template_folder='templates',
                          url_prefix='/user-service')

@user_service.route('/<user_id>')
def getUserProfile(user_id):
    '''Given an user_id, return the corresponding UserProfile to it'''

    # get reference to user profiles collection
    user_profiles_doc_ref = db_client.user_profiles_collection

    # get query reference
    user_profile_query = user_profiles_doc_ref.where(filter=FieldFilter("uid", "==", user_id))

    # get stream of results
    user_profiles = user_profile_query.stream()

    for user_profile in user_profiles:
        user_profile = user_profile.to_dict()
        return user_profile

    # error if no user profile exists
    abort(NotFound.code)

@user_service.route('/create-profile', methods=['POST'])
def createUserProfile():
    data = request.json

    # print data for now
    print(f"JSON {data}")
    return "JOE"
