const { execSync } = require("child_process");
const libsVersion = require('../../libs/package.json').version;
const labsVersion  = require('../../libs/template/labs/package.json').version;

function main() {
  const labsVersion = getNewLabsVersion();
  console.log('Setting new version of labs package');
  setLabsVersion(labsVersion);

  console.log('Creating tag');
  createTag(labsVersion);

  console.log('Pushing to git')
  pushToGit();

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

function createTag(version) {
  try {
    runCmd(`git tag -a labs@${version} -m ''`);
  } catch (e) {
    console.log('Failed to create a tag')

    throw e;
  }
}

function setLabsVersion(labsVersion) {
  try {
    runCmd(`npm --prefix ./template/labs version ${labsVersion}`);
  } catch (e) {
    console.log('Failed to set labs version')

    throw e;
  }

  try {
    runCmd(`npm --prefix ../dist/libs/template/labs version ${labsVersion}`);
  } catch (e) {
    console.log('Failed to set labs version inside dist')

    throw e;
  }
}

function publishToNpm() {
  try {
    runCmd(`npm publish ../dist/libs/template/labs`);
  } catch (e) {
    console.log('Failed to publish labs package')

    throw e;
  }
}

function pushToGit() {
  try {
    runCmd(`git push origin HEAD --tags --dry-run`);
  } catch (e) {
    console.log('Failed to push')

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
