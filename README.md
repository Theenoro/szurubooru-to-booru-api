
- [szurubooru to booru api](#szurubooru-to-booru-api)
  - [Info](#info)
    - [Asking why? No? :( anyway](#asking-why-no--anyway)
    - [What is Booru?](#what-is-booru)
  - [What does it?](#what-does-it)
  - [Install](#install)
    - [Docker - Stack](#docker---stack)
    - [Docker](#docker)
      - [Structure in this configuration](#structure-in-this-configuration)
      - [Install](#install-1)
      - [add enviroment variables](#add-enviroment-variables)
    - [Bare nodejs](#bare-nodejs)
      - [Structure in this configuration](#structure-in-this-configuration-1)
      - [Install](#install-2)
      - [add enviroment variables to .env](#add-enviroment-variables-to-env)
# szurubooru to booru api

## Info

### Asking why? No? :( anyway

I'm using an app called `Booru Nav` where you can add various types of `Booru` based websites. The selfhosted booru variant `szurubooru` isn't supported, cause the API endpoints doesn't match. That is why I've decided to make a converter proxy thing. 

### What is Booru?

In short: `Booru` based websites are image hosting websites where you can of course upload images, add meta information, add related images of somethin, comments, create image collections called pools. 

Maybe I'm wrong, but it's sort of my definition. 

## What does it?

This thing rewrites the `szurubooru` endpoint that the app can understand. Basically it rewrites the json request from the app to the one `szurubooru` understands and then rewrites the response.

The app doesn't try a request on `/api/posts`, instead it other urls like `/posts.json`. 



## Install

### Docker - Stack

- [README.me - Stack Info](./docker/README.md)
- [docker-compose.yml](./docker/docker-compose.yml)

### Docker

#### Structure in this configuration
```yml
server:
    dockerHost:
        ip: 192.168.0.2
        # installed szurubooru with exposed port 8090
```

#### Install

```
docker pull theenoro/szurubooru_to_booru_api
```
#### add enviroment variables
```ini
REDIRECTURL_INTERNAL_STACK="http://192.168.0.2:8090"
BASEURL_SZURUBOORU="http://192.168.0.2:5432"
DEBUG=1
```

### Bare nodejs

#### Structure in this configuration

```yml
server:
    dockerHost:
        ip: 192.168.0.2
        # installed szurubooru with exposed port 8090
    nodejsHost:
        ip: 192.168.0.3
        # installed nodejs - (tested with nodejs 16)
```

#### Install

```sh
git clone https://github.com/Theenoro/szurubooru-to-booru-api
cd szurubooru-to-booru-api
npm install
nano .env
```
#### add enviroment variables to .env
```ini
REDIRECTURL_INTERNAL_STACK="http://192.168.0.2:8090"
BASEURL_SZURUBOORU="http://192.168.0.3:5432"
DEBUG=1
```


