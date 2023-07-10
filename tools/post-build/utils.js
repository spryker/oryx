const fs = require('fs');
const path = require('path');

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) {
      yield* walk(entry);
    } else if (d.isFile()) {
      yield entry;
    }
  }
}

const defaultSourceFileFilter = function (sourceFilePath) {
  return /\.(js|ts)$/.test(sourceFilePath) && !/node_modules/.test(sourceFilePath);
};

const defaultModuleFilter = function (importedModule) {
  return !path.isAbsolute(importedModule) && !importedModule.startsWith('@') && !importedModule.endsWith('.js');
};

const defaultOptions  = {
  sourceFileFilter: defaultSourceFileFilter,
  moduleFilter: defaultModuleFilter,
};

module.exports = {
  walk,
  defaultOptions,
  defaultSourceFileFilter,
  defaultModuleFilter
}
