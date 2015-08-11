#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

git remote add prod dokku@rloop.org:rloop.org
git remote add dev dokku@rloop.org:dev

git fetch prod
git fetch dev

git checkout master
git branch -u prod/master
git branch -u dev/wrong-branch

git checkout master-qa
git branch -u prod/wrong-branch
git branch -u dev/master
