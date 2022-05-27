const { execSync, ExecSyncOptions } = require('child_process');

/**
 * @param {string} name
 * @param {ExecSyncOptions=} options
 * @returns {string}
 */
function runScript(name, options = {}) {
  return execSync(getScriptCmd(name), {
    ...options,
    env: { ...process.env, ...options.env },
    stdio: 'inherit',
    encoding: 'utf-8',
  });
}

function getScriptCmd(name) {
  return `npm run ${name}`;
}

module.exports = {
  runScript,
  getScriptCmd,
};
