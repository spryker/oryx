#!/bin/sh
ROOT="${1:-../../../}"
LIB="${2:-node_modules/@spryker-oryx}"

cd $ROOT

if ! patch -R -s -f --dry-run node_modules/lit-html/development/experimental-hydrate.js < $LIB/template/application/patches/experimental-hydrate.patch; then
  patch node_modules/lit-html/development/experimental-hydrate.js < $LIB/template/application/patches/experimental-hydrate.patch
fi


cp $LIB/template/application/patches/experimental-hydrate.js node_modules/lit-html/experimental-hydrate.js

exit 0
