import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { UserConfig } from 'vitest';

export default async function vitestExecutor(
  options: UserConfig,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(context.root, projectDir);

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
