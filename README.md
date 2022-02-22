## Description

This repository is practice for docker and postgres to be used as a template for future applications. I will further add authentication to the project.

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
