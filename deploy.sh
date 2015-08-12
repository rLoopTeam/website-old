#!/usr/bin/env bash
set -ev

DEPLOY_HOST=rloop.org
DEPLOY_USER=dokku

DEV_REPO=dev
PROD_REPO=prod

npm run build
mv .gitignore .gitignore.old
curl www.gitignore.io/api/Node,OSX,Windows,Linux,Vim,Emacs,SublimeText,Textmate,Webstorm > .gitignore

echo "Deploying"
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
    git remote add tmpDeployRemote "$DEPLOY_USER@$DEPLOY_HOST:$PROD_REPO"
elif [ "$BRANCH" == "master-qa" ]; then
    echo "Deploying to dev"
    git remote add tmpDeployRemote "$DEPLOY_USER@$DEPLOY_HOST:$DEV_REPO"
fi

git subtree push --prefix build tmpDeployRemote master
cat .gitignore.old > .gitignore
rm -rf .gitignore.old

echo "Deployed"