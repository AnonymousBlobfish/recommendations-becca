#!/bin/bash

time mongoimport -d wegot -c restaurants --file db/data/output.json --numInsertionWorkers 4
mongo --eval "db.restaurants.createIndex({place_id: 1});"
