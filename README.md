## Description

This repository is practice for docker and postgres to be used as a template for future applications. I will further add authentication to the project. 

## Installation

```bash
$ docker-compose up
```

## Remove images 

```bash
# development
$ docker rmi -f $(docker images -a -q)
```

## Remove containers

```bash
# development
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