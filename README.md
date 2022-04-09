# tss-wifi
A simple home app that allows user to get details about my wifi


# Setting up the development environment
Bringing up the containers
```bash
$ cd tss-wifi
$ docker-compose up
```
Interacting with the postgres container
```bash
docker exec -ti tss-wifi_postgresdb_1 bash
psql -U postgres
```