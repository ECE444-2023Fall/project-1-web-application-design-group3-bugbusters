from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_server.global_config import search_client

report_service = Blueprint('report_service', __name__, url_prefix='/report-service')

@report_service.route('/report/<event_id>', methods=['POST'])
def report(event_id):
    data = request.json
    if data.get('report', True) == False:
        update_data = {'_event_id': event_id, '_reported': False}
    else:
        update_data = {'_event_id': event_id, '_reported': True}

    search_client.update_index(update_data['_event_id'], update_data)

    return {'message': 'Event reported successfully!', 'event_id': event_id}, 200