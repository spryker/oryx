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
    await runCommands(
      {
        command: `npx tsc ${
          options.tsconfigPath ? '-p ' + options.tsconfigPath : ''
        }`,
        cwd: projectRoot,
      },
      context
    );
  }

  // TODO: workaround to avoid transpiling of dynamic import
  const { startVitest } = await Function("return import ('vitest/node')")();

  const result = await startVitest([], {
    ...options,
    root: projectRoot,
  });

  if (!options.watch) {
    return { success: result };
  }

  return new Promise(() => {});
}
