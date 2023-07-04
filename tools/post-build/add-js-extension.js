// This script is needed to add js extension for every internal path, as it's needed for every es module
// with specified "type: module" in package.json. For now only webpack require this.

const fs = require('fs');
const path = require('path');
const { walk, defaultOptions, defaultSourceFileFilter, defaultModuleFilter } = require('./utils');

function resolveImportPath(sourceFile, importPath, options) {
  const sourceFileAbs = path.resolve(process.cwd(), sourceFile);
  const root = path.dirname(sourceFileAbs);
  const { moduleFilter = defaultModuleFilter } = options;

  if (moduleFilter(importPath)) {
    const importPathAbs = path.resolve(root, importPath);
    let possiblePath = [
      path.resolve(importPathAbs, './index.ts'),
      path.resolve(importPathAbs, './index.js'),
      importPathAbs + '.ts',
      importPathAbs + '.js',
    ];

    if (possiblePath.length) {
      for (let i = 0; i < possiblePath.length; i++) {
        let entry = possiblePath[i];
        if (fs.existsSync(entry)) {
          const resolved = path.relative(root, entry.replace(/\.ts$/, '.js'));

          if (!resolved.startsWith('.')) {
            return './' + resolved;
          }

          return resolved;
        }
      }
    }
  }

  return null;
}

function replace(filePath, outFilePath, options) {
  const code = fs.readFileSync(filePath).toString();
  const newCode = code.replace(
    /(import|export) (.+?) from ('[^\n']+'|"[^\n"]+");/gs,
    function (found, action, imported, from) {
      const importPath = from.slice(1, -1);
      const resolvedPath = resolveImportPath(filePath, importPath, options);

      if (resolvedPath) {
        console.log('\t', importPath, resolvedPath);
        return `${action} ${imported} from '${resolvedPath}';`;
      }

      return found;
    }).replace(
    /(import|export)\(('[^\n']+'|"[^\n"]+")\)/gs,
    function (found, action, from) {
      const importPath = from.slice(1, -1);
      const resolvedPath = resolveImportPath(filePath, importPath, options);

      if (resolvedPath) {
        console.log('\t', importPath, resolvedPath);
        return `${action}('${resolvedPath}')`;
      }

      return found;
    }).replace(
    /(import) ('[^\n']+'|"[^\n"]+")/gs,
    function (found, action, from) {
      const importPath = from.slice(1, -1);
      const resolvedPath = resolveImportPath(filePath, importPath, options);

      if (resolvedPath) {
        console.log('\t', importPath, resolvedPath);
        return `${action} '${resolvedPath}'`;
      }

      return found;
    });

  if (code !== newCode) {
    fs.writeFileSync(outFilePath, newCode);
  }
}

async function run(srcDir, options = defaultOptions) {
  const {
    sourceFileFilter = defaultSourceFileFilter,
  } = options;

  for await (const entry of walk(srcDir)) {
    if (sourceFileFilter(entry)) {
      console.log(entry);
      replace(entry, entry, options);
    }
  }
}

run('./dist/libs/', defaultOptions);
