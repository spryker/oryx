const { getVersion } = require('./lerna');

function main() {
  const libsVersion = getVersion();

  releaseLabs(libsVersion);
}

function releaseLabs(libsVersion) {

}

main();
