#!/usr/bin/env bash
set -ev

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

REMOTE=rloopTmpDeployRemote

chmod +x ./git_ssh.sh

git status

if GIT_SSH=./git_ssh.sh PKEY=id_rsa git ls-remote --exit-code "$REMOTE" > /dev/null; then
    git remote rm "$REMOTE"
fi

#create new git repository and add everything
cd build
git init
git add .
git commit -m"init"

if [ "$BRANCH" == "master" ]; then
    echo "Deploying to Production"
    git remote add "$REMOTE" "$DEPLOY_USER@$DEPLOY_HOST:$PROD_REPO"
elif [ "$BRANCH" == "master-qa" ]; then
    echo "Deploying to dev"
    git remote add "$REMOTE" "$DEPLOY_USER@$DEPLOY_HOST:$DEV_REPO"
fi

if GIT_SSH=./git_ssh.sh PKEY=id_rsa git ls-remote --exit-code "$REMOTE" > /dev/null; then
    git remote rm "$REMOTE"
fi

#pull heroku but then checkback out our current local master and mark everything as merged
GIT_SSH=./git_ssh.sh PKEY=id_rsa git pull dokku master
git checkout --ours .
git add -u
git commit -m"merged"

#push back to heroku, open web browser, and remove git repository
GIT_SSH=./git_ssh.sh PKEY=id_rsa git push dokku master
rm -fr .git

#go back to wherever we started.
cd -

echo "Deployed"