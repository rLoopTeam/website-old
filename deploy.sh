#!/usr/bin/env bash

set -ev
if [ -n "${TRAVIS_BRANCH+1}" ]; then
    BRANCH="$TRAVIS_BRANCH"
else
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

if [ "$BRANCH" == "master" ]; then
    npm run deployProd
elif [ "$BRANCH" == "master-qa" ]; then
    npm run deployDev
fi