const { getLastTag } = require('./git');
const { getVersion } = require('./lerna');
const { runScript } = require('./scripts');
const { areVersionsDiffByMinor } = require('./version');

const RC_TAG = '-rc';

function main() {
  const currentVersion = getVersion();

  if (currentVersion.includes(RC_TAG)) {
    return releaseLatestRc();
  }

  const releasedVersion = getLastTag();

  if (releasedVersion.includes(RC_TAG)) {
    return releaseLatestFromRc();
  }

  if (areVersionsDiffByMinor(currentVersion, releasedVersion)) {
    releaseLatestRc();
  } else {
    releaseLatest();
  }
}

function releaseLatestRc() {
  console.log('Releasing Latest RC...');
  runScript('release:tag', { env: { RELEASE_TAG: 'rc' } });
}

function releaseLatestFromRc() {
  console.log('Releasing Latest from RC...');
  runScript('release:from-tag');
}

function releaseLatest() {
  console.log('Releasing Latest...');
  runScript('release');
}

main();
