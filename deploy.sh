#!/usr/bin/env bash
set -ev

git config --global user.email "travis@rloop.org"
git config --global user.name "Travis CI"

#DEPLOY_HOST=rloop.org
DEPLOY_HOST=104.236.128.222
DEPLOY_USER=dokku

DEV_REPO=dev
PROD_REPO=prod

npm run build
touch build/.static
cat .env > build/.env

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

chmod +x ./git_ssh.sh

#create new git repository and add everything
cd build
git init
git add .
git commit -m"init"

if [ "$BRANCH" == "master" ]; then
    echo "Deploying to Production"
    git remote add dokku "$DEPLOY_USER@$DEPLOY_HOST:$PROD_REPO"
elif [ "$BRANCH" == "master-qa" ]; then
    echo "Deploying to dev"
    git remote add dokku "$DEPLOY_USER@$DEPLOY_HOST:$DEV_REPO"
fi

#pull dokku but then checkback out our current local master and mark everything as merged
GIT_SSH=../git_ssh.sh PKEY=../id_rsa git pull --no-commit dokku master
git checkout --ours .
git add -u
git commit -m"merged"

#push back to dokku and remove git repository
GIT_SSH=../git_ssh.sh PKEY=../id_rsa git push dokku master
rm -fr .git

#go back to wherever we started.
cd -

echo "Deployed"