#!/bin/bash

echo "Building"
grunt build

echo "Deploying"
set -ev
echo "Checking for branch"
if [ -n "${TRAVIS_BRANCH+1}" ]; then
    echo "Using travis branch"
    BRANCH="$TRAVIS_BRANCH"
else
    echo "Using git branch"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

echo $BRANCH

if [ "$BRANCH" == "master" ]; then
    echo "Deploying to Production"
    npm run deployProd
elif [ "$BRANCH" == "master-qa" ]; then
    echo "Deploying to dev"
    npm run deployDev
fi
echo "Deployed"