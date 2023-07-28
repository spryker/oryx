const promisify = require('util').promisify;
const copyfiles = require('copyfiles');
const glob = require('fast-glob');
const copyfilesAsync = promisify(copyfiles);

const VERBOSE = !!process.env.VERBOSE;

const log = console.log;
const info = VERBOSE ? console.info : () => {};

/**
 * Copy many files (globs) into destination (glob)
 * @param {string[]} files
 */
async function main(files) {
  if (files.length < 2) {
    throw new InvalidArgsError('<..files>', '<destination>');
  }

  const sources = files.slice(0, -1); // All except last element
  const destGlob = files.slice(-1); // Last element

  log(`Copying files ${sources.join(', ')} to ${destGlob}...`);

  const destinations = await glob(destGlob, { onlyDirectories: true });

  if (destinations.length === 0) {
    throw new NoDestError();
  }

  info(`Expanded destinations:\n\t${destinations.join('\n\t')}`);

  await chainAsync(destinations, (destination) => {
    info(`Copying files into ${destination}...`);
    return copyfilesAsync([...sources, destination]);
  });
}

main(process.argv.slice(2)).catch((e) => {
  const msg = e instanceof MultiCopyError ? e.stack : `Unexpected error: ${e}`;
  const exitCode = e instanceof MultiCopyError ? e.code : MultiCopyError.code;
  console.error(msg);
  process.exit(exitCode);
});

/**
 * @param {any[]} values
 * @param {(value: any, prevValue?: any) => Promise<any>} fn
 * @param {any=} initialValue
 * @returns {Promise<any>}
 */
function chainAsync(values, fn, initialValue) {
  return values.reduce(
    (prevPromise, value) =>
      prevPromise.then((prevValue) => fn(value, prevValue)),
    Promise.resolve(initialValue),
  );
}

class MultiCopyError extends Error {
  static get code() {
    return 1;
  }

  constructor(msg, code = MultiCopyError.code) {
    super(msg);
    this.name = this.constructor.name;
    this.code = code;
    this.message = this.message + ` [CODE:${code}]`;
  }
}

class InvalidArgsError extends MultiCopyError {
  static get code() {
    return 2;
  }

  constructor(...args) {
    super(`Invalid arguments: ${args.join(', ')}`, InvalidArgsError.code);
  }
}

class NoDestError extends MultiCopyError {
  static get code() {
    return 3;
  }

  constructor() {
    super('Destination does not exist', NoDestError.code);
  }
}
