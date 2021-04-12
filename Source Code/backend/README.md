# TierHub Backend

## Setup

### Requirements
* [Docker](https://www.docker.com/products/docker-desktop)

### Building the Docker Image
Run the following commands:
```
$ docker image build -t "tierhubflask"
$ docker container -p 5000:5000 run "tierhubflask"
```
The TierHub Flask back end should now be accesible and running at the following URL: http://localhost:5000