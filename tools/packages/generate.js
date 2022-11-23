// It's a temporary script to automate building of tarballs from oryx libraries.
// This script runs nx build, then generating tarball for every oryx library and moving all tarball into `packages` folder.
// And then publishing them into verdaccio registry.

const { execSync } = require('child_process');
const { readdirSync, copyFileSync, rmSync } = require('fs');
const fastGlob = require('fast-glob');
const consoleOutputSettings = { stdio: 'ignore' };

const currentDir = process.cwd();
const libDistPath = `${currentDir}/dist/libs`;
const packsDir = `packages`;
const scriptLoggingPrefix = 'Generate packages:';

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirEntry => dirEntry.isDirectory())
    .map(dirEntry => dirEntry.name);

console.log(`${scriptLoggingPrefix} Removing ${packsDir} folder.`);
rmSync(`${packsDir}`, { recursive: true, force: true });

console.log(`${scriptLoggingPrefix} Creating ${packsDir} folder.`);
execSync(`mkdir -p ${packsDir}`, consoleOutputSettings);

// console.log(`${scriptLoggingPrefix} Clearing npm cache.`);
// execSync('npm cache clean --force', consoleOutputSettings);

console.log(`${scriptLoggingPrefix} Building libraries.`);
execSync('nx run-many --target=build --all --exclude storybook,launchpad,storefront,picking-app --parallel=5', consoleOutputSettings);

const libDirs = getDirectories(libDistPath);

execSync(`cd ${libDistPath}/`, consoleOutputSettings);

console.log(`${scriptLoggingPrefix} Creating tarballs.`);
libDirs.forEach(dir => {
  execSync(`cd ${libDistPath}/${dir}/ && npm pack && cd ..`, consoleOutputSettings);
});

execSync(`cd ..`, consoleOutputSettings);

const orgName = 'spryker-oryx';
const packageVersion = '1.0.0';
const tarballs = fastGlob.sync([`**/${orgName}*.tgz`]);
const customRegistry = '--registry http://localhost:4873';

tarballs.forEach(tar => {
  const tarballFileName = tar.split('/').slice(-1)[0];
  const tarDir = `${currentDir}/${packsDir}/${tarballFileName}`;
  const packageName = tarballFileName.split(`${orgName}-`)[1].split(`-${packageVersion}`)[0];

  copyFileSync(tar, `${currentDir}/${packsDir}/${tarballFileName}`);
  rmSync(tar);

  execSync(`npm unpublish @spryker-oryx/${packageName} ${customRegistry} --force`, consoleOutputSettings);
  console.log(`${scriptLoggingPrefix} Publishing ${packageName} package.`);
  execSync(`npm publish ${tarDir} ${customRegistry}`, consoleOutputSettings);


  // try {
  //   console.log(`${scriptLoggingPrefix} Publishing ${packageName} package.`);
  //   execSync(`npm publish ${tarDir} ${customRegistry}`, consoleOutputSettings);
  // } catch(e) {
  //   console.log(`${scriptLoggingPrefix} Something went wrong, have to unpublish ${packsDir} package.`);
  //   execSync(`npm unpublish @spryker-oryx/${packageName} ${customRegistry} --force`, consoleOutputSettings);
  //   console.log(`${scriptLoggingPrefix} Publishing ${packageName} package.`);
  //   execSync(`npm publish ${tarDir} ${customRegistry}`, consoleOutputSettings);
  // }
});

console.log(`${scriptLoggingPrefix} Removing ${packsDir} folder.`);
rmSync(`${packsDir}`, { recursive: true, force: true });

console.log(`${scriptLoggingPrefix} Removing ${libDistPath} folder.`);
rmSync(`${libDistPath}`, { recursive: true, force: true });
