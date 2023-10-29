# ClubHub
## Getting Started
1. Clone the repository
`git clone git@github.com:ECE444-2023Fall/project-1-web-application-design-group3-bugbusters.git`
2. Install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/) on your machine
3. Initialize `FLASK_PORT` environment variable to be the port the flask container should bind. For example `export FLASK_PORT=7001`. By Default, `FLASK_PORT=5001` will be used.
4. Initialize `REACT_PORT` environment variable to be the port the react container should bind. For example `export REACT_PORT=7002`. By Default, `REACT_PORT=5002` will be used.
5. Run `bash dev.sh build` from the root of the repository to build the development images
6. Run `bash dev.sh up` from the root of the repository to attach to the development container
    - To only build the flask-server and react-native application run `bash dev.sh build flask-server`
    and `bash dev.sh build react-app` respectively
7. The flask server should be running in the docker container on port 7001 and the react native
application should be running in the development environment with expo on port 7002
8. Bring down the container(s) with `bash dev.sh down`

## Project Management Tools
We are using Notion to perform project management, however, it is a private project
which cannot be shared

## File Structure
    .
    ├── flask-server/           # flask server project
    │   ├── src/                # source for server files
    │   ├── test/               # test
    │   ├── .gitignore          # gitignore file for server
    │   ├── pyproject.toml      # python configuration of flask_server module
    │   └── README.md           # installation and scripting instructions
    ├── frontend/               # react application project
    │   ├── assets/             # static application assets
    │   ├── src/                # source for react app files
    │   ├── .gitignore          # gitignore file for react app
    │   ├── App.js              # main application file
    │   ├── app.json            # app configuration
    │   ├── babel.config.json   # transpiler configuration
    │   ├── package-lock.json   # dependency tree
    │   ├── package.json        # dependency configuration
    └── CODE_OF_CONDUCT.MD      # code of conduct
    └── CONTRIBUTION.MD         # rules for contribution
    └── README.MD               # repository information

## Contributing
If you want to make a contribution, please follow the next steps:

1. Fork the Project
2. Create your Feature Branch from `develop` (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m '<type>(<scope>): <subject>')
4. Push the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request to be merged into `develop`, do **not** target `main`

## Releases
Releases are to be created by merging `develop` into `main`, `main` will then be used to create a release

### Lab 5
Ali - flask-server/test/unit/test_event_service.py. Unit test "test_create_event" - https://github.com/ECE444-2023Fall/project-1-web-application-design-group3-bugbusters/blob/Ali/CreateEventEndpoint/flask-server/test/unit/test_event_service.py#L64-L72
