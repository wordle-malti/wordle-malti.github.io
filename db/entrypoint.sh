#!/bin/bash
set -e 
set -o pipefail

export LANG=C.UTF-8
export LESSCHARSET=utf-8

URL="https://mlrs.research.um.edu.mt/resources/gabra-api/data/gabra_data_2022-01-01.tar.gz"

apt update && \
    apt install -y wget python3 python3-pip

pip3 install jsonlines

mkdir -p /tmp/gabra

wget -O /tmp/gabra/latest.tar.gz "$URL"

mkdir -p /tmp/gabra/extracted
tar zxvf /tmp/gabra/latest.tar.gz -C /tmp/gabra/extracted

cd /tmp/gabra/extracted
find . -type f -iname 'lexemes.bson' -print0 | xargs -0 -I {} mv {} .
find . -type f -iname 'wordforms.bson' -print0 | xargs -0 -I {} mv {} .

bsondump --outFile=lexemes.json lexemes.bson
bsondump --outFile=wordforms.json wordforms.bson

cp /tmp/werdil/db/vocab-builder.py .

python3 vocab-builder.py

cp dictionary.json /tmp/werdil/site/dictionary.json

echo "Dictionary populated and stored under site/dictionary.json."