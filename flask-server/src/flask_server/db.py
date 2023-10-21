import git
import os
from flask_server.classes.database_client import DataBaseClient

# Authenticate credentials so we can access our firebase project
git_repo = git.Repo(os.getcwd(), search_parent_directories=True)
repo_root = git_repo.git.rev_parse("--show-toplevel")
json_path = "flask-server/ece444bulletin-firebase-adminsdk.json"
json_path = os.path.join(repo_root, json_path)
db_client = DataBaseClient(json_path)
