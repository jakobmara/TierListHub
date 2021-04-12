# TierHub FrontEnd

## Setup

### Requirements
* [Docker](https://www.docker.com/products/docker-desktop)

### Building the Docker Image
Run the following commands:
```
$ docker image build -t "tierhubreact"
$ docker container -p 3000:3000 run "tierhubreact"
```
The TierHub React front end should now be accesible and running at the following URL: http://localhost:3000