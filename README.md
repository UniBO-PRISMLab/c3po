[![Site: IoTPrismLab](https://img.shields.io/badge/site-IoT%20Prism%20Lab-blue)](http://iot-prism-lab.nws.cs.unibo.it/)

# C3PO
The C3PO (**C**onverter of O**P**en A**P**I S**P**ecification to WoT **O**bjects) translates [OpenAPI specification](https://swagger.io/specification/) (both versions 2 and 3) to [W3C WoT Thing Descriptions](https://www.w3.org/WoT/) and deploys them as a Web Thing proxy of the real application.

## Usage with Docker

### Docker and Docker Compose

This application can be deployed as a [Docker](https://www.docker.com) container. If you do not have **Docker** installed yet, follow the instructions [here](https://docs.docker.com/install/).You can check your current **Docker** version using the following commands:

```console
$ docker version
```
In order to build and run the container from DockerHub:

```console
$ docker run -p 3333:3333 -p 3334:3334 --name c3po ivanzy/c3po:1.1 
```

## Usage with NPM

To install all dependencies of the Adapter and deploy it execute the following commands:

```console
$ npm install
$ npm run start
```

## Test

To test if C3PO is running correctly, check your browser at <http://localhost:3334/api-docs/>.

## Configuration

C3PO configurations are defined in the [config.json file](src/config/conf.json)


```json
{
    "translator": {
        "host": "<IP ADDRESS>",
        "port": 3334
    },
    "wot": {
        "host": "<IP ADDRESS>",
        "port": 3333
    },
    "logLevel": "info"
}
```

* translator: the port and hots that C3PO will run execute.
* wot: the port and host for accessing the Web Things created.
* logLevel: the log level of the adapter. The default is "info", choose "debug" for more details or "warning" for less.