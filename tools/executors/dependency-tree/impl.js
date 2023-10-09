'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const project_graph_1 = require('@nx/workspace/src/core/project-graph');
const fs_1 = require('fs');
const utils_1 = require('./utils');
async function depsExecutor(options, context) {
  const { projectName } = context;
  const { update } = options;
  console.info(`Generating dependencies for ${projectName}`);
  console.info(`Generating dependency graph`);
  const graph = await (0, project_graph_1.createProjectGraphAsync)();
  const dependencies = (0, utils_1.getDependencies)(graph, projectName);
  if (update) {
    console.info(`Updating file...`);
    (0, fs_1.writeFileSync)(
      `apps/${projectName}/dependencies.sh`,
      `DEPENDENCIES="${dependencies}"`
    );
    return { success: true };
  }
  console.log(dependencies);
  console.info(`Checking if dependencies match...`);
  const realDependencies = (0, fs_1.readFileSync)(
    `apps/${projectName}/dependencies.sh`,
    {
      encoding: 'utf8',
      flag: 'r',
    }
  ).match(/"([^"]+)"/)[1];
  console.log(realDependencies);
  if (dependencies !== realDependencies) {
    console.log(
      `Defined dependencies do not match with the current ones, please generate them with "npx nx deps ${projectName} --update"`
    );
    return { success: false };
  }
  console.log('Defined dependencies match with the current ones');
  return { success: true };
}
exports.default = depsExecutor;
