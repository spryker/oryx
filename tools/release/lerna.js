const { resolve } = require('path');

/**
 * @param {string=} cwd
 * @returns string
 */
function getConfigPath(cwd = process.cwd()) {
  return resolve(cwd, 'lerna.json');
}

/**
 * @param {string=} cwd
 * @returns {Record<string, unknown>}
 */
function getConfig(cwd) {
  return require(getConfigPath(cwd));
}

/**
 * @param {string=} cwd
 * @returns {string}
 */
function getVersion(cwd) {
  return getConfig(cwd).version;
}

/**
 * @param {string=} cwd
 * @returns {string=}
 */
function getTagPrefix(cwd) {
  return getConfig(cwd).command?.publish?.tagVersionPrefix;
}

module.exports = {
  getConfig,
  getVersion,
  getTagPrefix,
};
