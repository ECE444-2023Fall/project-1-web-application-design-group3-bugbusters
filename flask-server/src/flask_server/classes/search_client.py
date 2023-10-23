from algoliasearch.search_client import SearchClient

class AlgoliaSearchClient:
    
    def __init__(self, app_id, api_key, index_name):
        self.client = SearchClient.create(app_id, api_key)
        self.index = self.client.init_index(index_name)

    def add_to_index(self, object_id, content):
        """
        Add or replace an object in the index.
        """
        content["objectID"] = object_id
        self.index.save_object(content)

    def search_index(self, query, **kwargs):
        """
        Search the index.
        """
        return self.index.search(query, **kwargs)

    def update_index(self, object_id, content):
        """
        Partially update an object in the index.
        """
        content["objectID"] = object_id
        self.index.partial_update_object(content)

    def delete_from_index(self, object_id):
        """
        Delete an object from the index by its objectID.
        """
        self.index.delete_object(object_id)