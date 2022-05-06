# This file loads up an alpine container with all the data in this directory mounted as /app
# Can be used testing or running the app in a linux environment from windows using docker desktop.

docker run --rm -it -v ${pwd}:/app -w /app node:16.14-alpine /bin/sh
