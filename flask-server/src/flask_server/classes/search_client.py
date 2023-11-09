from algoliasearch.search_client import SearchClient
from datetime import datetime

class AlgoliaSearchClient:
    
    def __init__(self, app_id, api_key, index_name):
        self.client = SearchClient.create(app_id, api_key)
        self.index = self.client.init_index(index_name)

    def add_to_index(self, event_id, data):
        """
        Add or replace an object in the index.
        """
        content = {}
        content["objectID"] = event_id
        content["event_title"] = data.get("_event_title", "")
        content["description"] = data.get("_description", "")
        content["location"] = data.get("_location", "")
        content["event_start_time"] = data.get("_event_start_time", "")
        content["event_end_time"] = data.get("_event_end_time", "")
        content["_tags"] = data.get("_tags", [])
        content["header_image_URL"] = data.get('_header_image', '')
        content["friendly_creator_name"] = data.get('_friendly_creator_name', '')
        content["reported"] = False

        self.index.save_object(content)

    def search_index(self, query, filters="", start_time=None, end_time=None):
        """
        Search the index.
        """
        if start_time == None:
            start_time = float('-inf')
        if end_time == None:
            end_time = float('inf')

        if(filters == ""):
            search_result = self.index.search(query)
        else:
            search_result = self.index.search(query, {"filters": filters})

        return_result = {}
        return_result['results'] = []
        for result in search_result['hits']:
            event_start_time = datetime.strptime(result['event_start_time'], "%Y-%m-%dT%H:%M:%S.%f").timestamp()
            event_end_time = datetime.strptime(result['event_end_time'], "%Y-%m-%dT%H:%M:%S.%f").timestamp()
            if start_time > event_start_time or end_time < event_end_time:
                continue

            else:
                obj = {}
                obj['description'] = result.get('description', '')
                obj['event_title'] = result.get('event_title', '')
                obj['header_image_URL'] = result.get('header_image_URL', '')
                obj['friendly_creator_name'] = result.get('friendly_creator_name', '')
                obj['start_time'] = result.get('event_start_time', '')
                obj['end_time'] = result.get('event_end_time', '')
                return_result['results'].append(obj)
        
        return_result['nbHits'] = len(return_result['results'])
        return return_result

    def update_index(self, event_id, data):
        """
        Partially update an object in the index.
        """
        content = {}
        content["objectID"] = event_id

        event_title = data.get("_event_title", None)
        if event_title:
            content["event_title"] = event_title

        description = data.get("_description", None)
        if description:
            content["description"] = description

        location = data.get("_location", None)
        if location:
            content["location"] = location

        start_time = data.get("_event_start_time", None)
        if start_time:
            content["event_start_time"] = start_time

        end_time = data.get("_event_end_time", None)
        if end_time:
            content["event_end_time"] = end_time

        tags = data.get("_tags", None)
        if tags:
            content["_tags"] = tags

        header_image_url = data.get("_header_image", None)
        if header_image_url:
            content["header_image_URL"] = header_image_url

        friendly_creator_name = data.get("_friendly_creator_name", None)
        if friendly_creator_name:
            content["friendly_creator_name"] = friendly_creator_name

        reported = data.get("_reported", None)
        if reported != None:
            content["reported"] = reported

        self.index.partial_update_object(content)

    def delete_from_index(self, event_id):
        """
        Delete an object from the index by its objectID.
        """
        self.index.delete_object(event_id)