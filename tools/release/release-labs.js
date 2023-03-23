const { execSync } = require("child_process");
const libsVersion = require('../../libs/package.json').version;
const labsVersion  = require('../../libs/template/labs/package.json').version;

function main() {
  console.log('Checking the version of the labs package');
  setLabsVersion(getNewLabsVersion());

  console.log('Releasing labs package');
  publishToNpm();
}

function getNewLabsVersion() {
  const undottedLibsVersion = getUndottedLibsVersion(libsVersion);
  const labsPatch = Number(getLabsPatch());
  const isNewLibsRelease = getLabsMinor() !== undottedLibsVersion;

  return isNewLibsRelease ? `0.${undottedLibsVersion}.0` : `0.${undottedLibsVersion}.${labsPatch + 1}`;
}

function getLabsPatch() {
  return labsVersion.split('.').pop();
}

function getLabsMinor() {
  return Number(labsVersion.split('.').at(1));
}

function getUndottedLibsVersion(libsVersion) {
  return Number(libsVersion.replaceAll('.', ''));
}

function setLabsVersion(labsVersion) {
  try {
    runCmd(`npm --prefix ./libs/template/labs version ${labsVersion}`);
  } catch (e) {
    console.log('Failed to set labs version')

    throw e;
  }

  try {
    runCmd(`npm --prefix ./dist/libs/template/labs version ${labsVersion}`);
  } catch (e) {
    console.log('Failed to set labs version inside dist')

    throw e;
  }
}

function publishToNpm() {
  try {
    runCmd(`npm --prefix ./dist/libs/template/labs publish`);
  } catch (e) {
    console.log('Failed to publish labs package')

    throw e;
  }
}

function runCmd(command, options = {}) {
  return execSync(command, {
    ...options,
    env: { ...process.env, ...options.env },
    stdio: 'inherit',
    encoding: 'utf-8',
  });
}

main();
