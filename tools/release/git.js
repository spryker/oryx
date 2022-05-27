const { execSync } = require('child_process');

function getLastTag() {
  const cmd = `git describe --tags --abbrev=0`;
  return execSync(cmd, { encoding: 'utf-8' });
}

module.exports = {
  getLastTag,
};
