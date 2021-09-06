#!/bin/sh

for i in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do
    echo "STARTING REPLICATION $i"

    node ../index &
    pid=$!
    sleep 4

    echo "REQUEST MADE"
    curl --request POST \
        --url http://localhost:3334/arrowhead \
        --header 'content-type: application/json' \
        --data '{"systemName": "performanceanalysis0" }'

    sleep 15
    echo "KILLING NODE..."
    kill $pid

    sleep 2

done
