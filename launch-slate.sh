#!/bin/bash
# This script start a server for slate from slate image.
# if you want to add file to this docker image, use the following command
# docker cp {FILE or FOLDER} slate-server:/app/slate/source
set -e
echo "Start slate on port 4567"
open http://localhost:4567/index.html
docker run --env MIDDLEMAN_COMMAND=server --name slate-server --rm -p 4567:4567 -it docker.appdirect.tools/documentation/slate:test
