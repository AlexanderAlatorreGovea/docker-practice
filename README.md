## Description

This repository is practice for docker and postgres to be used as a template for future applications. I will further add authentication to the project.

## The following are the local host addresses 

Database PG-Admin: http://localhost:5050/browser/

NESTJS api: http://localhost:3000

## To update to the latest nest version

```bash
$ nest update --force
```

## Installation

```bash
$ docker-compose up
```

## Remove images

```bash
# command to remove images
$ docker rmi -f $(docker images -a -q)
```

## Remove containers

```bash
# command to drop containers
$ docker rm -vf $(docker ps -a -q)
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Other Docker commands

```bash
# List your docker images:
$ docker images

# List your running containers:
$ docker ps

# List also stopped containers:
$ docker ps -a

# Kill a running container: 
$ docker kill <id of container from docker ps (first 3 letters)>

# Example of "kill a running container": 
docker kill fea
```
