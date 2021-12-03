#!/bin/sh

#sleep 10
ciao=100
sleep 3906

for i in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do
#for i in 22 23 24 25 26 27 28 29 30; do
    echo "STARTING REPLICATION $i"
    #ciao=$((ciao + 50))
    #workload+=10
    sleep 1
#      curl --request POST \
#          --url http://137.204.143.89:3000/start \
#          --header 'content-type: application/json' \
#          --data '{
#      "lambda":'$ciao',
#      "time": 180,
#      "name": "exp_net_wot_'$ciao'_'$i'",
#      "wot":true,
#      "url": {
#          "get": "http://c3po:3333/mockapi/properties/get-status",
#          "post":  "http://c3po:3333/mockapi/actions/post-status",
#          "delete":  "http://c3po:3333/mockapi/actions/delete-status",
#          "put":  "http://c3po:3333/mockapi/properties/put-status",
#          "patch":  "http://c3po:3333/mockapi/properties/put-status"
#      }
#  }'

     curl --request POST \
         --url http://137.204.143.89:3000/start \
         --header 'content-type: application/json' \
         --data '{
     "lambda":'$ciao',
     "time": 180,
     "name": "exp_noWoT_net_'$ciao'_'$i'",
     "url": {
         "get": "http://mockapi:8888/status",
         "post":  "http://mockapi:8888/status",
         "delete":  "http://mockapi:8888/status",
         "put":  "http://mockapi:8888/status",
         "patch":  "http://mockapi:8888/status"
     }
 }'

    sleep 185
    echo "REQUEST MADE"

done
