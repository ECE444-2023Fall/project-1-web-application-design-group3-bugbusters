from flask import Blueprint, abort, request
from flask_server.classes.user_profile import UserProfile
from flask_server.global_config import db_client
from google.cloud.firestore_v1.base_query import FieldFilter
from werkzeug.exceptions import BadRequest, NotFound, Forbidden


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

    try:
        user_profile = UserProfile.from_json(data)
    except TypeError as type_error:
        abort(BadRequest.code)

    # get uid for indexing
    uid = data.get('uid')

    # get reference to user profiles collection
    user_profiles_doc_ref = db_client.user_profiles_collection

    # get query reference
    user_profile_query = user_profiles_doc_ref.where(filter=FieldFilter("uid", "==", uid))

    # get stream of results
    user_profiles = user_profile_query.stream()

    # if user profile exists, error 403
    for _ in user_profiles:
        abort(Forbidden.code)

    # Retrieve the json back from our obj
    user_profile_data = user_profile.to_json()

    # Add the user profile data to the Firestore "UserProfiles" collection
    _update_time, _profile_ref = user_profiles_doc_ref.add(user_profile_data)
    return user_profile_data, 201
