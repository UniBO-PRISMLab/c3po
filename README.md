[![Site: IoTPrismLab](https://img.shields.io/badge/site-IoT%20Prism%20Lab-blue)](http://iot-prism-lab.nws.cs.unibo.it/)

# WoT-Arrowhead Adapter

The WoT-Arrowhead Adapter (WAE) converts Web Things to Arrowhead services and converts Arrowhead services into Web Things.

## Usage with Docker

### Docker and Docker Compose

This application can be deployed as a [Docker](https://www.docker.com) container. If you do not have **Docker** installed yet, follow the instructions [here](https://docs.docker.com/install/) .

You can check your current **Docker** version using the following commands:

```console
$ docker version
```

WAE has a docker image ready to be used publically available in [DockerHub](https://hub.docker.com/repository/docker/ivanzy/wot-arrowhead-enabler). In order to instantiate the container run the following commands with admin privileges:

```console
$ docker pull ivanzy/wot-arrowhead-enabler
$ docker run -p 3333:3333 -p 3334:3334 ivanzy/wot-arrowhead-enabler
```

It is also possible to build and run the container from the project directory;

```console
$ git clone https://github.com/UniBO-PRISMLab/wot-arrowhead-adapter
$ cd wot-arrowhead-adapter/
$ docker build -t wot-arrowhead-adapter:1.0 .
$ docker run -p 3333:3333 -p 3334:3334 --name wot-arrowhead-adapter wot-arrowhead-adapter:1.0 
```

## Usage with NPM

npm is a package manager for the JavaScript programming language. To install all dependencies of the Adapter and deploy it execute the following commands:

```console
$ npm install
$ npm run start
```

## Test

to test if the WoT-Arrowhead Adapter is running correctly, check your browser at <http://localhost:3334>, the response should be:
```json
{
   "status":"Arrowhead API Its Working",
   "message":"Arrowhead version 1.0.0 is running",
   "description":"The WoT-Arrowhead Adapter converts Web Things to Arrowhead services and converts Arrowhead services into Web Things"
}
```

The project API documentation can be consulted at <http://localhost:3334/docs-api> once the application is running.

## Configuration

The WoT-Arrowhead Adapter configurations are defined in the [config.json file](src/config/conf.json)


```json
{
    "arrowhead": {
        "host": "<IP ADDRESS>",
        "port": 8443
    },
    "wotRepository": {
        "host": "<IP ADDRESS>",
        "port": 8080
    },
    "poolingInterval": 10,
    "adapter": {
        "port": 3334
    },
    "wot": {
        "port": 3333
    },
    "mode": {
        "arrowheadAdapter": false,
        "wotAdapter": true,
        "wotRepository": "wot or modron"
    },
    "logLevel":"info"
}
```
* arrowhead: configure the IP address and port for the Arrowhead Service Registry
* wotRepository: configure the IP address and port for the WoT Repository. It can be a list of Web Things defined according to the [W3C WoT specification](https://w3c.github.io/wot-discovery/) or the [Modron](https://api.modron.network/graphql) server address.
* poolingInterval: the interval in seconds to pool from arrowhead server and from the wot repository.
* adapter: the port that the WoT-Arrowhead Adapter will run execute.
* wot: the port for accessing the Web Things created.
* mode: specific configurations of the WoT-Arrowhead Adapter
  * arrowheadAdapter: true if you want to instantiate Arrowhead services as Web Things, false otherwise.
  * wotAdapter: true if you want to instantiate Web Things Arrowhead services, false otherwise.
  * wotRepository: the two modes are "modron" or "wot". Use wot if you are not using modron server.
* logLevel: the log level of the adapter. The default is "info", choose "debug" for more details or "warning" for less.

### Modron Usage

To connect the adapter with Modron, it is necessary to create a .env file in /src containing the user and password for the given modron server.

```
MODRON_PASSWORD= <MODRON PASSWORD>
MODRON_USER= <MODRON USER>
```
{"mode":"full","isActive":false}
