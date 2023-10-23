from flask import Blueprint, request, jsonify
from ..classes.search_client import AlgoliaSearchClient
from dotenv import load_dotenv
import os

# Load configuration from some source
load_dotenv()
ALGOLIA_APP_ID = 'GS4ISHV4RC'
ALGOLIA_API_KEY = os.getenv('ALGOLIA_API_KEY')
ALGOLIA_INDEX_NAME = 'ClubHubSearchIndex'

search_service = Blueprint('search_service', __name__)

# Initialize the AlgoliaSearchClient
search_client = AlgoliaSearchClient(ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME)

@search_service.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    search_results = search_client.search_index(query)
    return jsonify(search_results)


@search_service.route('/add', methods=['POST'])
def add_to_index():
    content = request.json
    object_id = content.get('objectID')

    if not object_id:
        return jsonify({"error": "objectID is required"}), 400

    search_client.add_to_index(object_id, content)
    return jsonify({"message": "Added to index successfully"}), 201


@search_service.route('/update', methods=['PATCH'])
def update_index():
    content = request.json
    object_id = content.get('objectID')

    if not object_id:
        return jsonify({"error": "objectID is required"}), 400

    search_client.update_index(object_id, content)
    return jsonify({"message": "Updated index successfully"}), 200


@search_service.route('/delete', methods=['DELETE'])
def delete_from_index():
    object_id = request.args.get('objectID')

    if not object_id:
        return jsonify({"error": "objectID query parameter is required"}), 400

    search_client.delete_from_index(object_id)
    return jsonify({"message": "Deleted from index successfully"}), 200