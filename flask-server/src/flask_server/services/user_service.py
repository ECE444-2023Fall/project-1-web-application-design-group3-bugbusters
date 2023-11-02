from flask import Blueprint, abort, request
from flask_server.classes.user_profile import UserProfile
from flask_server.global_config import db_client
from werkzeug.exceptions import BadRequest, NotFound, Forbidden


user_service = Blueprint('user_service', __name__, template_folder='templates',
                          url_prefix='/user-service')

@user_service.route('/<user_id>')
def getUserProfile(user_id):
    '''Given an user_id, return the corresponding UserProfile to it'''

    # get reference to user profiles collection
    user_profiles_collection_ref = db_client.user_profiles_collection

    # get doc reference
    user_profiles_doc_ref = user_profiles_collection_ref.document(user_id)

    # Get the data of the event document
    user_profile = user_profiles_doc_ref.get().to_dict()

    if not user_profile:
        # error if no user profile exists
        abort(NotFound.code)

    return user_profile


@user_service.route('/create-profile', methods=['POST'])
def createUserProfile():
    data = request.json

    # check that all required fields exist and no extra fields exist
    try:
        user_profile = UserProfile.from_json(data)
    except TypeError as type_error:
        abort(BadRequest.code)

    # get uid for indexing
    uid = data.get('uid')

    # get reference to user profiles collection
    user_profiles_collection_ref = db_client.user_profiles_collection

    # get doc reference
    user_profiles_doc_ref = user_profiles_collection_ref.document(uid)

    # Get the data of the event document
    user_profile = user_profiles_doc_ref.get().to_dict()

    # if user profile exists, error 403
    if not user_profile:
        abort(Forbidden.code)

    # Retrieve the json back from our obj
    user_profile_data = user_profile.to_json()

    # Add the user profile data to the Firestore "UserProfiles" collection
    _update_time, _profile_ref = user_profiles_doc_ref.add(user_profile_data)
    return user_profile_data, 201
