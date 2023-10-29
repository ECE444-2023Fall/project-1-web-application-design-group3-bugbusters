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

## Ben Goel Unit Testing
All tests under test/unit/test_common.py were written by Ben Goel for Lab 5.

# Pros / Cons of TDD
There are many pros and cons of test driven development. In my experience, TDD's greatest strength is maintaining high levels of test coverage, if the "rules" of TDD are followed. From my PEY experience, a quote that resonates with me was said by my manager, that "tests aren't just written to make sure a feature works, its to make sure a feature will work tomorrow". In this regard, TDD helps to catch regressions in the code early. I also think TDD serves as a means of documentation, for if there exists a test, then it indirectly explains the functionality of the pieces of code it touches. I personally like TDD because it helps to quickly verify the implementation of whatever you are working on, whether that is a utility script, or an end-to-end integration test. On the other hand, TDD can often be cumbersome when a primary objective is rapid iteration and growth of the codebase. Although, I find that NOT testing the code ALWAYS costs more in the long run than the cost of typing tests! TDD requires a lot of testing infrastructure to be implemented first before actual features may be worked on. More importantly, the infrastructure can only be designed if an implementation is already in mind. This leads to a form of circular-dependency in the design of TDD. The most important aspect of TDD is that developers must write good, quality tests for TDD to be a good, recommendable practice. If the tests are incorrect, then the code will be too!
