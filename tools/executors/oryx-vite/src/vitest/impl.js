"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const run_commands_impl_1 = require("@nrwl/workspace/src/executors/run-commands/run-commands.impl");
async function vitestExecutor(options, context) {
    var _a, _b;
    const projectDir = context.workspace.projects[context.projectName].root;
    const projectRoot = (0, devkit_1.joinPathFragments)(context.root, projectDir);
    if (!options.typechekingOff) {
        const path = options.tsconfigPath ? `-p ${options.tsconfigPath}` : '';
        await (0, run_commands_impl_1.default)({
            command: `npx tsc ${path}`,
            cwd: projectRoot,
            // TODO: check this
            __unparsed__: [''],
        }, context);
    }
    if (options.watch) {
        delete options.coverage;
    }
    else {
        // list of files that should be included
        // by default
        (_a = options.coverage).include ?? (_a.include = [`${projectDir}/**/*.ts`]);
        (_b = options.coverage).exclude ?? (_b.exclude = []);
        // list of files that should be excluded
        // as coverage is not important for them
        options.coverage.exclude.push(...[
            '**/vitest.config.ts',
            '**/index.ts',
            '**/.constants.ts',
            '**/*.spec.ts',
            '**/*mock*.ts',
            '**/*.stories.ts',
            '**/stories/*.*',
            '**/stories/**/*.*',
            '**/*.schema.ts',
            '**/*.styles.ts',
            '**/*.def.ts',
            '**/*.model.ts',
            '**/mocks/**/*',
            '**/*.mixin.ts',
            '**/constants.ts',
            '**/feature.ts',
        ]);
        // Don't remove this log, it is used in Unit Tests coverage reports analysis
        // We should be able to see which files are included in the analysis to not miss something
        console.log('Unit tests run config: ', options);
    }
    // TODO: workaround to avoid transpiling of dynamic import
    const { startVitest } = await Function("return import ('vitest/node')")();
    await startVitest('test', [], {
        ...options,
        root: projectRoot,
    });
    if (!options.watch) {
        return { success: !process.exitCode };
    }
    return new Promise(() => { });
}
exports.default = vitestExecutor;
//# sourceMappingURL=impl.js.map