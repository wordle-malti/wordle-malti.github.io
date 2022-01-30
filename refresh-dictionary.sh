#!/bin/bash

docker run --rm --entrypoint /tmp/werdil/db/entrypoint.sh \
    -v "$(pwd):/tmp/werdil" \
    mongo:latest