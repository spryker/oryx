// This script is needed to fix wrong imports in d.ts files

const fs = require('fs');
const { walk } = require('./utils');

function replace(filePath, outFilePath) {
  const code = fs.readFileSync(filePath).toString();

  // 1. We are replacing wrong relative paths to di package, changing domain relative folder structure to the flat to make it working inside node_modules
  // 2. We are adding js extension to the `lit-html/directives/ref` path
  // 3. We are adding js extension to the `lit-html/directive` path
  const newCode = code
    .replaceAll(/..\/base\//gs, '')
    .replaceAll('"lit-html/directives/ref"', '"lit-html/directives/ref.js"')
    .replaceAll('"lit-html/directive"', '"lit-html/directive.js"');

  if (code !== newCode) {
    fs.writeFileSync(outFilePath, newCode);
  }
}

async function run(srcDir) {
  for await (const entry of walk(srcDir)) {
    console.log(entry);
    replace(entry, entry);
  }
}

run('./dist/libs/');
