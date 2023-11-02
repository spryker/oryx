const semver = require('semver');
const { execSync } = require("child_process");
const currentLibsVersion = require('../../libs/lerna.json').version;
const currentLabsVersion  = require('../../libs/template/labs/package.json').version;

function main() {
  const labsVersion = getNewLabsVersion();
  console.log('Setting new version of labs package');
  setLabsVersion(labsVersion);

  console.log('Commiting to git');
  commitToGit(labsVersion);

  console.log('Creating tag');
  createTag(labsVersion);

  console.log('Pushing to git');
  pushToGit();

  console.log('Releasing labs package');
  publishToNpm();
}

function getNewLabsVersion() {
  const labsPatchDelimiter = '-patch.';
  const oryxVersionDelimiter = '-oryx.';
  const labsFixedVersion = '0.131.0'; // First available minor for labs
  const isNewLibsRelease = currentLibsVersion !== getPreviousLibsVersion(oryxVersionDelimiter, labsPatchDelimiter);
  const labsPatch = isNewLibsRelease ? 0 : Number(getLabsPatch(labsPatchDelimiter)) + 1;

  return `${labsFixedVersion}${oryxVersionDelimiter}${currentLibsVersion}${labsPatchDelimiter}${labsPatch}`;
}

function getLabsPatch(labsPatchDelimiter) {
  return currentLabsVersion.split(labsPatchDelimiter)[1];
}

function getPreviousLibsVersion(oryxVersionDelimiter, labsPatchDelimiter) {
  return currentLabsVersion.split(oryxVersionDelimiter)[1].split(labsPatchDelimiter)[0];
}

function createTag(version) {
  try {
    runCmd(`git tag -a labs@${version} -m ''`);
  } catch (e) {
    throw e;
  }
}

function setLabsVersion(labsVersion) {
  try {
    runCmd(`npm --prefix ./template/labs version ${labsVersion}`);
  } catch (e) {
    throw e;
  }

  try {
    runCmd(`npm --prefix ../dist/libs/template/labs version ${labsVersion}`);
  } catch (e) {
    throw e;
  }
}

function publishToNpm() {
  try {
    runCmd(`npm publish ../dist/libs/template/labs --access=public`);
  } catch (e) {
    throw e;
  }
}

function commitToGit() {
  try {
    runCmd(`git add .`);
    runCmd(`git commit -m 'chore(release): bump labs version [skip ci]'`);
  } catch (e) {
    throw e;
  }
}

function pushToGit() {
  try {
    runCmd(`git push origin HEAD --tags --no-verify`);
  } catch (e) {
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
