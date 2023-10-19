# ClubHub
## Getting Started
1. Clone the repository
`git clone git@github.com:ECE444-2023Fall/project-1-web-application-design-group3-bugbusters.git`
2. Install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/) on your machine
3. Run `docker compose build` from the root of the repository
4. Run `docker compose up` from the root of the repository
5. The flask server should be running in the docker container

### NOTE: currently, only the flask server is dockerized, awaiting react application to be merged


## File Structure
Helps reader understand what files do what and where to find certain files

## Contributing
If you want to make a contribution, please follow the next steps:

1. Fork the Project
2. Create your Feature Branch from `develop` (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m '<type>(<scope>): <subject>')
4. Push the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request to be merged into `develop`, do **not** target `main`

## Releases
Releases are to be created by merging `develop` into `main`, `main` will then be used to create a release
