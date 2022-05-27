const semver = require('semver');

/**
 * @param {string} version1
 * @param {string} version2
 * @returns boolean
 */
function areVersionsDiffByMinor(version1, version2) {
  const ver1 = semver.coerce(version1);
  const ver2 = semver.coerce(version2);

  const verDiff = semver.diff(ver1, ver2, {
    includePrerelease: false,
  });

  return verDiff === 'major' || verDiff === 'minor';
}

module.exports = {
  areVersionsDiffByMinor,
};
