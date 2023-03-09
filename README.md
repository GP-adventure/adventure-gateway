# Adventure App

Adventure managing app for tabletop RPG.

## Services Overview

<img alt="Services Overview" src="https://i.imgur.com/ww37bHW.png"/>

## Service Description

Adventure-Gateway microservice is responsible for routing API calls from adventure-frontend to other services and
controlling auth traffic.

## Installation

Prepare `.env` file, include
variables: `authServiceConfig_port`, `authServiceConfig_host`, `authServiceConfig_authProtoPath` (path to `auth.proto`
in `node_modules`)

``npm install``

``npm run proto:install``

``npm run proto:auth``

``npm run start:dev``

## Future Features

- Dockerfile and CI/CD files - for deployment
- Logger - logging all incoming requests and errors
- Graphana - connect with performance analysis service
