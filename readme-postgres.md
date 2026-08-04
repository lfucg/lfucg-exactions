# Connecting to Postgres in Local Dev

1. add line `portforward: 5434` to [./.lando.yml](./.lando.yml) under
   `database` service
2. run `lando rebuild -y` to rebuild containers
3. run `lando start` to restart containers
4. run `docker ps | grep exactions` and look for a postgresql container,
   it should show exposed port `127.0.0.1:5434->5432/tcp`
4. install [pgAdmin 4](https://www.pgadmin.org/)
5. configure new db server
    1. connection tab: host name: `127.0.0.1`
    2. save and connect
6. in connected server tree, browse to `exactions => Databases => django =>
   Schemas => Public => Tables`, and you should see the program tables.
