# Running in Docker Stack

## Structure

```yml
server:
    dockerHost:
        ip: 192.168.0.2
        stack:
            network: 172.20.1.1/29
            # exposes port 5432 from the proxy
            # uses ips from 172.20.1.1 - 172.20.1.5
```

## Install 

- [docker-compose.yml](./docker-compose.yml)

> you may edit the `./szurubooru/` from the used volumes

- add folders to your base volume folder as:
    - config
    - data
    - sql

### add enviroment variables
```ini
POSTGRES_USER=szurubooru
POSTGRES_PASSWORD=szurubooru
THREADS=4

HOST_URL=http://192.168.0.2
PORT_PROXY=5432
DEBUG=0
```