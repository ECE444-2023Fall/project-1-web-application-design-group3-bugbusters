from algoliasearch.search_client import SearchClient

class AlgoliaSearchClient:
    
    def __init__(self, app_id, api_key, index_name):
        self.client = SearchClient.create(app_id, api_key)
        self.index = self.client.init_index(index_name)

    def add_to_index(self, event_id, content):
        """
        Add or replace an object in the index.
        """
        content["objectID"] = event_id
        content["event_title"] = content.get("_event_title", "")
        content["description"] = content.get("_description", "")
        content["location"] = content.get("_location", "")
        content["event_start_time"] = content.get("_event_start_time", "")
        content["event_end_time"] = content.get("_event_end_time", "")
        content["_tags"] = content.get("_tags", [])
        self.index.save_object(content)

    def search_index(self, query, filters=""):
        """
        Search the index.
        """
        if(filters == ""):
            return self.index.search(query)
        else:
            return self.index.search(query, {"filters": filters})

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