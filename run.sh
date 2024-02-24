#!/bin/bash

cloudlinux-selector run-script --json --interpreter nodejs --app-root repository --script-name build
cloudlinux-selector run-script --json --interpreter nodejs --app-root repository --script-name purgecss
rsync --delete -acv --exclude=".*" ~/repository/build/ ~/repository/public/ ~/public_html
rm -rf ~/repository/build/