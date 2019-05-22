#!/bin/sh
node build/app.js &
cd static
python3 -m http.server --bind 127.0.0.1 8081