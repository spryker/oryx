import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';

export interface IconSet {
  input: string;
  output: string;
}

interface Options {
  iconSets: IconSet[];
}

export default async function echoExecutor(
  options: Options,
  context: ExecutorContext
) {
  const cwd = context.workspace.projects[context.projectName].root;
  const iconSets = JSON.stringify(options.iconSets).replace(
    /"/g,
    `"${String.fromCharCode(92)}"`
  );

  const tsConfig = `npx cross-env TS_NODE_PROJECT="./tools/executors/generate-icon-sprites/svg-module/tsconfig.json"`;
  const nodeConfiguration =
    '--loader=ts-node/esm --es-module-specifier-resolution=node';
  const file = `./tools/executors/generate-icon-sprites/svg-module/svg.ts`;
  const properties = `--iconSets='${iconSets}' --cwd=${cwd}`;

  try {
    await execSync(
      `${tsConfig} node ${nodeConfiguration} ${file} ${properties}`,
      {
        stdio: 'inherit',
      }
    );
  } catch {
    return { success: false };
  }

  return { success: true };
}
