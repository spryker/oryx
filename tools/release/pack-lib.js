const path = require('path');
const copyfiles = require('copyfiles');
const { getPackageName } = require('./lerna');

const libName = getPackageName();
const root = path.resolve(__dirname, '../..');

const sourceRoot = path.join(root, `dist/libs/${libName}`);
const sourceRelative = path.relative(process.cwd(), sourceRoot);
const sourceDepth = sourceRelative.split(path.sep).length;

const source = `${sourceRelative}/**/*`;
const dest = `./dist`;

console.log(`Copying lib ${libName} from ${source} into ${dest}...`);

copyfiles([source, dest], { up: sourceDepth }, (err) => {
  if (err) {
    console.error(`Failed to copy lib ${libName}: ${err}`);
    process.exit(1);
  }
});