"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
async function echoExecutor(options, context) {
    const cwd = context.workspace.projects[context.projectName].root;
    const iconSets = JSON.stringify(options.iconSets).replace(/"/g, `"${String.fromCharCode(92)}"`);
    const tsConfig = `npx cross-env TS_NODE_PROJECT="./tools/executors/generate-icon-sprites/svg-module/tsconfig.json"`;
    const nodeConfiguration = '--loader=ts-node/esm --es-module-specifier-resolution=node';
    const file = `./tools/executors/generate-icon-sprites/svg-module/svg.ts`;
    const properties = `--iconSets='${iconSets}' --cwd=${cwd}`;
    try {
        await (0, child_process_1.execSync)(`${tsConfig} node ${nodeConfiguration} ${file} ${properties}`, {
            stdio: 'inherit',
        });
    }
    catch {
        return { success: false };
    }
    return { success: true };
}
exports.default = echoExecutor;
