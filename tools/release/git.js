const { execSync } = require('child_process');

/**
 * @param {string=} tagGlob Filter tags by a glob pattern
 * @returns string
 */
function getLastTag(tagGlob) {
  let cmd = `git describe --tags --abbrev=0`;

  if (tagGlob) {
    cmd += ` --match "${tagGlob.replace(/"/g, '\\"')}"`;
  }

  return execSync(cmd, { encoding: 'utf-8' });
}

module.exports = {
  getLastTag,
};
