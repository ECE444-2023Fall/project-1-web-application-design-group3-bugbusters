from algoliasearch.search_client import SearchClient
from dateutil.parser import parse as DateParser

class AlgoliaSearchClient:
    
    def __init__(self, app_id, api_key, testing=False):
        self._testing = testing
        self.client = SearchClient.create(app_id, api_key)
        self.fields = {
        "_event_title": "event_title",
        "_description": "description",
        "_location": "location",
        "_event_start_time": "event_start_time",
        "_event_end_time": "event_end_time",
        "_tags": "tags",
        "_header_image": "header_image_URL",
        "_friendly_creator_name": "friendly_creator_name",
        "_reported": "reported",
        "_creator_id": "creatorID"
    }
        if self._testing == False:
            self.index_name = 'ClubHubSearchIndex'
        else:
            self.index_name = 'test_ClubHubSearchIndex'

        self.index = self.client.init_index(self.index_name)

    def set_testing(self, is_testing):
        if is_testing == True:
            self.index_name = 'test_ClubHubSearchIndex'
        else:
            self.index_name = 'ClubHubSearchIndex'
        self.index = self.client.init_index(self.index_name)

    
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
        content["header_image_URL"] = data.get('_images', {}).get('_header_image', '')
        content["friendly_creator_name"] = data.get('_friendly_creator_name', '')
        content["reported"] = False
        content["creatorID"] = data.get('_creator_id', "")

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
            event_start_time = self.parse_search_datetime(result['event_start_time'])
            event_end_time = self.parse_search_datetime(result['event_end_time'])
            if start_time > event_start_time or end_time < event_end_time:
                continue

            else:
                obj = {}
                obj['event_title'] = result.get('event_title', '')
                obj['header_image_URL'] = result.get('header_image_URL', '')
                obj['friendly_creator_name'] = result.get('friendly_creator_name', '')
                obj['start_time'] = result.get('event_start_time', '')
                obj['end_time'] = result.get('event_end_time', '')
                obj['event_ID'] = result.get('objectID', '')
                return_result['results'].append(obj)
        
        return_result['nbHits'] = len(return_result['results'])
        return return_result

    def update_index(self, event_id, data):
        """
        Partially update an object in the index.
        """
        content = {"objectID": event_id}
        
        # Iterate over the fields and update content if data is present
        for data_key, content_key in self.fields.items():
            value = data.get(data_key)
            if value is not None:  # This ensures that only non-None values are added
                content[content_key] = value

        if data.get('_images', {}).get('_header_image', None) != None:
            content['header_image_URL'] = data.get('_images', {}).get('_header_image', None)
        
        # Send the partial update to the index
        self.index.partial_update_object(content)

    def delete_from_index(self, event_id):
        """
        Delete an object from the index by its objectID.
        """
        self.index.delete_object(event_id)

    @staticmethod
    def parse_search_datetime(datetime_str):
        return DateParser(datetime_str).timestamp()
