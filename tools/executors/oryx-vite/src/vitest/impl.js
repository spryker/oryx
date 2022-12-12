"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const run_commands_impl_1 = require("@nrwl/workspace/src/executors/run-commands/run-commands.impl");
async function vitestExecutor(options, context) {
    const projectDir = context.workspace.projects[context.projectName].root;
    const projectRoot = (0, devkit_1.joinPathFragments)(context.root, projectDir);
    if (!options.typechekingOff) {
        await (0, run_commands_impl_1.default)({
            command: `npx tsc ${options.tsconfigPath ? '-p ' + options.tsconfigPath : ''}`,
            cwd: projectRoot,
            // check this
            __unparsed__: [''],
        }, context);
    }
    if (options.watch) {
        delete options.coverage;
    }
    // TODO: workaround to avoid transpiling of dynamic import
    const { startVitest } = await Function("return import ('vitest/node')")();
    const result = await startVitest('test', [], {
        ...options,
        root: projectRoot,
    });
    if (!options.watch) {
        return { success: result };
    }
    return new Promise(() => { });
}
exports.default = vitestExecutor;
