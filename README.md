# WoT-ArrowHead Adapter

The WoT-ArrowHead Adapter converts Web Things to ArrowHead services and converts ArrowHead services into Web Things.

## Usage with Docker

### Docker and Docker Compose

This application can be deployed as a Docker container [Docker](https://www.docker.com) container. If you do not have **Docker** installed yet, follow the instructions [here](https://docs.docker.com/install/) .

You can check your current **Docker** version using the following commands:

```console
$ docker version
```

In order to instantiate the container run the following commands with admin privileges:

```console
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

to test if the WoT-ArrowHead Adapter is running correctly, check your browser at <http://localhost:3334>, the response should be:

```json
{
    "status": "ArrowHead API Its Working",
    "message": "ArrowHead version 1.0.0 is running",
    "description": "The WoT-ArrowHead Adapter converts Web Things to ArrowHead services and converts ArrowHEad services into Web Things"
}
```
## Configuration

The WoT-ArrowHead Adapter configurations are defined in the  [config.json file](src/config/conf.json)


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
    }
}
```
* arrowhead: configure the IP address and port for the ArrowHead Service Registry
* wotRepository: configure the IP address and port for the WoT Repository. It can be a list of Web Things defined according to the [W3C WoT specification](https://w3c.github.io/wot-discovery/) or the [Modron](https://api.modron.network/graphql) server address.
* poolingInterval: the interval in seconds to pool from arrowhead server and from the wot repository.
* adapter: the port that the WoT-ArrowHead Adapter will run execute.
* wot: the port for accessing the Web Things created.
* mode: specific configurations of the WoT-ArrowHead Adapter
  * arrowheadAdapter: true if you want to instantiate ArrowHead services as Web Things, false otherwise.
  * wotAdapter: true if you want to instantiate Web Things asArrowHead services, false otherwise.
  * wotRepository: the two modes are "modron" or "wot". Use wot if you are not using modron server.
