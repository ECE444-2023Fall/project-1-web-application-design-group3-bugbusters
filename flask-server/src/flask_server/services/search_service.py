from flask import Blueprint, request, jsonify
from flask_server.global_config import search_client

search_service = Blueprint('search_service', __name__, url_prefix='/search-service')

@search_service.route('/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query', "")
    filters = data.get('filters', [])

    # convert search results into query results
    filters = " AND ".join(f"{tag}" for tag in filters)

    search_results = search_client.search_index(query, filters)

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
