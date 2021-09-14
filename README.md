[![Site: IoTPrismLab](https://img.shields.io/badge/site-IoT%20Prism%20Lab-blue)](http://iot-prism-lab.nws.cs.unibo.it/)

# WoT-Translator

The WoTTranslator converts OpenAPI schema to W3C WoT Thing Descriptions and deploys them.

## Usage with Docker

### Docker and Docker Compose

This application can be deployed as a [Docker](https://www.docker.com) container. If you do not have **Docker** installed yet, follow the instructions [here](https://docs.docker.com/install/).You can check your current **Docker** version using the following commands:

```console
$ docker version
```
In order to build and run the container from the project directory:

```console
$ git clone https://github.com/UniBO-PRISMLab/wot-translator
$ cd wot-translator/
$ docker build -t wot-translator:1.0 .
$ docker run -p 3333:3333 -p 3334:3334 --name wot-translator wot-translator:1.0 
```

## Usage with NPM

To install all dependencies of the Adapter and deploy it execute the following commands:

```console
$ npm install
$ npm run start
```

## Test

To test if the WoTTranslator is running correctly, check your browser at <http://localhost:3334/api-docs/>.

## Configuration

The WoTTranslator configurations are defined in the [config.json file](src/config/conf.json)


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

* translator: the port and hots that the WoTTranslator will run execute.
* wot: the port and host for accessing the Web Things created.
* logLevel: the log level of the adapter. The default is "info", choose "debug" for more details or "warning" for less.