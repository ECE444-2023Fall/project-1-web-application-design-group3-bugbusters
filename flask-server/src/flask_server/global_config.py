import os
import git
from dotenv import load_dotenv
from flask_server.classes.search_client import AlgoliaSearchClient
from flask_server.classes.database_client import DataBaseClient

# Load environment variables
load_dotenv()

# Instantiate the AlgoliaSearchClient
search_client = AlgoliaSearchClient('GS4ISHV4RC', os.getenv('ALGOLIA_API_KEY'), 'ClubHubSearchIndex')

# Instantiate the DB
# Authenticate credentials so we can access our firebase project
git_repo = git.Repo(os.getcwd(), search_parent_directories=True)
repo_root = git_repo.git.rev_parse("--show-toplevel")
json_path = "flask-server/ece444bulletin-firebase-adminsdk.json"
json_path = os.path.join(repo_root, json_path)
db_client = DataBaseClient(json_path)
