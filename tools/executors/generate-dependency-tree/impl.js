"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_graph_1 = require("@nrwl/workspace/src/core/project-graph");
const fs_1 = require("fs");
const utils_1 = require("../../utils");
async function echoExecutor(options) {
    console.info(`Generating dependencies for ${options.project}`);
    console.info(`Generating dependency graph`);
    const graph = await (0, project_graph_1.createProjectGraphAsync)();
    const dependencies = (0, utils_1.stringifyDependencies)((0, utils_1.findDependencies)(graph.dependencies, options.project), graph.nodes);
    console.log(dependencies);
    console.info(`Updating file...`);
    (0, fs_1.writeFileSync)(`apps/${options.project}/dependencies.sh`, `DEPENDENCIES="${dependencies}"`);
    return { success: true };
}
exports.default = echoExecutor;
