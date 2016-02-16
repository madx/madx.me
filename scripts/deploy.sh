#/usr/bin/env bash

rsync -avp --delete-after --chmod=o=rX build/ $(cat .deploy-target)
