import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { UserConfig } from 'vitest';

export default async function vitestExecutor(
  options: UserConfig & { typechekingOff?: boolean; tsconfigPath?: string },
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(context.root, projectDir);

  if (!options.typechekingOff) {
    const path = options.tsconfigPath ? `-p ${options.tsconfigPath}` : '';

    await runCommands(
      {
        command: `npx tsc ${path}`,
        cwd: projectRoot,
        // TODO: check this
        __unparsed__: [''],
      },
      context
    );
  }

  if (options.watch) {
    delete options.coverage;
  } else {
    // list of files that should be included
    // by default
    options.coverage.include ??= [`${projectDir}/**/*.ts`];

    options.coverage.exclude ??= [];

    // list of files that should be excluded
    // as coverage is not important for them
    options.coverage.exclude.push(
      ...[
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
        '**/providers.ts',
      ]
    );

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

  return new Promise(() => {});
}
