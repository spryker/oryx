#!/bin/sh

if ! patch -R -s -f --dry-run node_modules/@lit-labs/ssr/lib/util/parse5-utils.js < tools/patches/parse5-utils.patch; then
  patch node_modules/@lit-labs/ssr/lib/util/parse5-utils.js < tools/patches/parse5-utils.patch
fi

if ! patch -R -s -f --dry-run node_modules/lit-html/development/experimental-hydrate.js < tools/patches/experimental-hydrate.patch; then
  patch node_modules/lit-html/development/experimental-hydrate.js < tools/patches/experimental-hydrate.patch
fi

cp tools/patches/experimental-hydrate.js node_modules/lit-html/experimental-hydrate.js

exit 0
