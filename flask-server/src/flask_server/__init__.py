import os
from dotenv import load_dotenv


from flask import Flask
from flask_server.services.event_service import event_service
from flask_server.services.search_service import search_service

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # load in environment variables, throw an error if there is no .env file
    try:
        load_dotenv()
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    # a simple page that says hello
    @app.route('/')
    def hello():
        return 'Hello, World!'
    
    # Register event service
    app.register_blueprint(event_service)

    # Register search service
    app.register_blueprint(search_service)

    return app
