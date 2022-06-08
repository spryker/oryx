const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;

const fsStat = promisify(fs.stat);
const fsWriteFile = promisify(fs.writeFile);
const fsUnlink = promisify(fs.unlink);

const cwd = process.cwd();

const tasks = [updatePackage(cwd), removeChangelog(cwd)];

Promise.all(tasks).catch((err) => {
  console.error(err);
  process.exit(1);
});

async function updatePackage(libPath) {
  const packagePath = path.resolve(libPath, 'package.json');
  const packageDistPath = path.resolve(libPath, 'dist/package.json');

  console.log(`Updating package from ${packagePath} to ${packageDistPath}`);

  try {
    await fsStat(packageDistPath);
  } catch (e) {
    console.log(`No package.json in dist folder found! Skipping...`);
    return;
  }

  const package = require(packagePath);
  const packageDist = require(packageDistPath);

  packageDist.version = package.version;
  packageDist.dependencies = package.dependencies;

  await fsWriteFile(packageDistPath, JSON.stringify(packageDist, null, 2));
}

async function removeChangelog(libPath) {
  const changelogPath = path.resolve(libPath, 'dist', 'CHANGELOG.md');

  console.log(`Removing changelog ${changelogPath}`);

  try {
    await fsStat(changelogPath);
  } catch (e) {
    console.log(`No changelog in dist folder found! Skipping...`);
    return;
  }

  await fsUnlink(changelogPath);
}
