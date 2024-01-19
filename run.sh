#!/bin/bash

cloudlinux-selector install-modules --json --interpreter nodejs --app-root repository
cloudlinux-selector run-script --json --interpreter nodejs --app-root repository --script-name build
cloudlinux-selector run-script --json --interpreter nodejs --app-root repository --script-name purgecss
rsync --delete -acv --exclude=".*" ~/repository/build/ ~/repository/public/ ~/public_html
cloudlinux-selector stop --json --interpreter nodejs --app-root repository
pkill -9 node
rm -rf ~/repository/build/