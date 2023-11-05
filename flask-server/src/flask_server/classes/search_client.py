from algoliasearch.search_client import SearchClient

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

        self.index.save_object(content)

    def search_index(self, query, filters=""):
        """
        Search the index.
        """
        if(filters == ""):
            search_result = self.index.search(query)
        else:
            search_result = self.index.search(query, {"filters": filters})

        return_result = {}
        return_result['nbHits'] = search_result['nbHits']
        return_result['results'] = []
        for result in search_result['hits']:
            obj = {}
            obj['description'] = result.get('description', '')
            obj['event_title'] = result.get('event_title', '')
            obj['header_image_URL'] = result.get('header_image_URL', '')
            obj['friendly_creator_name'] = result.get('friendly_creator_name', '')
            return_result['results'].append(obj)
        
        return return_result

    def update_index(self, event_id, content):
        """
        Partially update an object in the index.
        """
        content["objectID"] = event_id
        content["event_title"] = content.get("_event_title", "")
        content["description"] = content.get("_description", "")
        content["location"] = content.get("_location", "")
        content["event_start_time"] = content.get("_event_start_time", "")
        content["event_end_time"] = content.get("_event_end_time", "")
        content["_tags"] = content.get("_tags", [])
        self.index.partial_update_object(content)

    def delete_from_index(self, event_id):
        """
        Delete an object from the index by its objectID.
        """
        self.index.delete_object(event_id)