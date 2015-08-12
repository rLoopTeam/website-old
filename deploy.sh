#!/usr/bin/env bash
set -ev

#DEPLOY_HOST=rloop.org
DEPLOY_HOST=104.236.128.222
DEPLOY_USER=dokku

DEV_REPO=dev
PROD_REPO=prod

npm run build
mv .gitignore .gitignore.old
curl www.gitignore.io/api/Node,OSX,Windows,Linux,Vim,Emacs,SublimeText,Textmate,Webstorm > .gitignore
echo "secure" >> ./.gitignore
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

if [ "$BRANCH" == "master" ]; then
    echo "Deploying to Production"
    git remote add "$REMOTE" "$DEPLOY_USER@$DEPLOY_HOST:$PROD_REPO"
elif [ "$BRANCH" == "master-qa" ]; then
    echo "Deploying to dev"
    git remote add "$REMOTE" "$DEPLOY_USER@$DEPLOY_HOST:$DEV_REPO"
fi

if git ls-remote --exit-code "$REMOTE" > /dev/null; then
    git remote rm "$REMOTE"
fi

KEY=$(pwd)/id_rsa
ssh-agent bash -c 'ssh-add $KEY; git subtree push --prefix build tmpDeployRemote master'
cat .gitignore.old > .gitignore
rm -rf .gitignore.old

echo "Deployed"