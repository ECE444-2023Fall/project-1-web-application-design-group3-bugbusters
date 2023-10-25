# Installation
In the future, all development will be done using the development container. For now, the flask-server will be locally
developed. To install the flask-server locally, it is suggested to have a venv with `setuptools` installed via `pip`.

## Steps
1. Ensure your pwd is `flask-server`
2. run `pip3 install -e '.[dev]'`
3. Copy authentication JSON from Notion into `clubhub/flask-server/` and name the JSON file
`ece444bulletin-firebase-adminsdk.json`
4. Create a file named `.env` in `clubhub/flask-server/` and copy in the backend environment variables from notion.
5. Try running the example flask server with `flask --app flask_server run --debug`
