const { execSync } = require("child_process");
const libsVersion = require('../../libs/package.json').version;
const labsVersion  = require('../../libs/template/labs/package.json').version;

function main() {
  setLabsVersion(getNewLabsVersion());

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
  runCmd(`npm --prefix ./libs/template/labs version ${labsVersion}`);
  runCmd(`npm --prefix ./dist/libs/template/labs version ${labsVersion}`);
}

function publishToNpm() {
  runCmd(`npm --prefix ./dist/libs/template/labs publish`);
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
