#!/bin/sh
ROOT="${1:-../../../}"
LIB="${2:-node_modules/@spryker-oryx}"

cd $ROOT

if ! patch -R -s -f --dry-run node_modules/@lit-labs/ssr/lib/util/parse5-utils.js < $LIB/template/application/patches/parse5-utils.patch; then
  patch node_modules/@lit-labs/ssr/lib/util/parse5-utils.js < $LIB/template/application/patches/parse5-utils.patch
fi

cp $LIB/template/application/patches/experimental-hydrate.js node_modules/lit-html/experimental-hydrate.js

exit 0
