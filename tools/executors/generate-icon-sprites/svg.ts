import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { join } from 'path';

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
  const iconSets = JSON.stringify(options.iconSets);
  const tsConfig = `TS_NODE_PROJECT=${join(
    __dirname,
    'svg-module/tsconfig.json'
  )}`;
  const nodeConfiguration =
    '--loader=ts-node/esm --es-module-specifier-resolution=node';
  const file = `${join(__dirname, 'svg-module/svg.ts')}`;
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
