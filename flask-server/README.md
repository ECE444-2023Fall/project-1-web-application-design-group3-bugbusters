# Installation
In the future, all development will be done using the development container. For now, the flask-server will be locally
developed. To install the flask-server locally, it is suggested to have a venv with `setuptools` installed via `pip`.

## Steps
1. Ensure your pwd is `flask-server`
2. run `pip3 install -e .`
3. Try running the example `db.py` script with `python3 src/db.py`
4. Try running the example flask server with `flask --app src run --debug`
