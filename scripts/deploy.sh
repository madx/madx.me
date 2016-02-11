#/usr/bin/env bash

rsync -avp --chmod=o=rX build/ $(cat .deploy-target)
