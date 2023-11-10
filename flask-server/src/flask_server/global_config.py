import os
from dotenv import load_dotenv
from flask_server.classes.search_client import AlgoliaSearchClient
from flask_server.classes.database_client import DataBaseClient

# Load environment variables
load_dotenv()

# Instantiate the AlgoliaSearchClient
search_client = AlgoliaSearchClient('GS4ISHV4RC', os.getenv('ALGOLIA_API_KEY'), testing=True)

# Instantiate the DB
# Authenticate credentials so we can access our firebase project
json_path = "ece444bulletin-firebase-adminsdk.json"
db_client = DataBaseClient(json_path, testing=True)
