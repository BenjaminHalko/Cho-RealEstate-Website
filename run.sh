#!/bin/bash

npm install
npm run build
npm run purgecss
rsync --delete -acv --exclude=".*" ~/repository/build/ ~/repository/public/ ~/public_html
cloudlinux-selector stop --json --interpreter nodejs --app-root repository
pkill -9 node
cloudlinux-selector start --json --interpreter nodejs --app-root repository
rm -rf ~/repository/build/