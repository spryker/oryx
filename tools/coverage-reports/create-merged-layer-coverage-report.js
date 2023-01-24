// This script generates a report that provides
// information on unit tests code coverage for layers
//
// The report is combined from smaller reports inside each layer,
// e.g. `libs/base` report will merge `di`, `form`, `ui`, `utilities` reports
//
// To be precise we do not calculate the final result as an average %,
// but rather we calculate everything from scratch based on total / covered lines
// ---
// For now, this report is published in CI job log (Unit Tests)
// but later they will be used in metrics collection automation

const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const layersDir = process.argv[2];

let statmCovered = 0;
let statmTotal = 0;
let branCovered = 0;
let branTotal = 0;
let funcCovered = 0;
let funcTotal = 0;
let linesCovered = 0;
let linesTotal = 0;

const indexFiles = findIndexFiles(layersDir);

indexFiles.forEach(file => {
  const content = fs.readFileSync(file, { encoding: 'utf-8' });
  const dom = new JSDOM(content);
  const fraction = dom.window.document.querySelectorAll('.pad1y .fraction');

  const statements = fraction[0].textContent.split('/');
  statmCovered += +statements[0];
  statmTotal += +statements[1];

  const branches = fraction[1].textContent.split('/');
  branCovered += +branches[0];
  branTotal += +branches[1];

  const functions = fraction[2].textContent.split('/');
  funcCovered += +functions[0];
  funcTotal += +functions[1];

  const lines = fraction[3].textContent.split('/');
  linesCovered += +lines[0];
  linesTotal += +lines[1];
});

const statmCoverage = ((statmCovered / statmTotal) * 100).toFixed(2);
const branCoverage = ((branCovered / branTotal) * 100).toFixed(2);
const funcCoverage = ((funcCovered / funcTotal) * 100).toFixed(2);
const linesCoverage = ((linesCovered / linesTotal) * 100).toFixed(2);

console.log(`Coverage report for layer:         ${layersDir}`);
console.log(`Number of merged coverage reports: ${indexFiles.length}`);
console.log(`---`);
console.log(`statements: ${statmCoverage}% | ${statmCovered}/${statmTotal}`);
console.log(`branches:   ${branCoverage}% | ${branCovered}/${branTotal}`);
console.log(`functions:  ${funcCoverage}% | ${funcCovered}/${funcTotal}`);
console.log(`lines:      ${linesCoverage}% | ${linesCovered}/${linesTotal}`);

/**
 * Return the list of main `index.html` files
 * that contain all coverage stats
 *
 * @param {string} layerPath - layer path (e.g. libs/base)
 *
 * @returns {string[]}}
 */
function findIndexFiles(layerPath) {
  const indexFiles = fs
    .readdirSync(layerPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .map(dir => `${layerPath}/${dir}/coverage/index.html`)
    .filter(indexFilePath => fs.existsSync(indexFilePath));

  return indexFiles;
}
