import { ExecutorContext } from '@nrwl/devkit';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  writeFileSync,
} from 'fs';
import { dirname, resolve } from 'path';
import {
  createProgram,
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
} from 'typescript';

export interface IconExecutorOptions {
  input: string;
  output: string;
}

export default async function echoExecutor(
  options: IconExecutorOptions,
  context: ExecutorContext
) {
  const cwd = context.workspace.projects[context.projectName].root;
  const tmpDir = `tmpSprite`;
  const tmpSprite = `${context.root}/${tmpDir}`;
  const pathToFolder = dirname(options.input);
  const removeTmpDir = () => {
    if (existsSync(`${tmpSprite}`)) {
      rmdirSync(`${tmpSprite}`, { recursive: true });
    }
  };
  console.info(`Getting the location of icon files`);
  const iconsPath = resolve(cwd, options.input);
  try {
    console.info(`Icon generating program`);
    const program = await createProgram([iconsPath], {
      moduleResolution: ModuleResolutionKind.NodeJs,
      target: ScriptTarget.ES2020,
      module: ModuleKind.CommonJS,
      outDir: tmpDir,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
    });
    program.emit();

    const files = readdirSync(`${tmpSprite}/${pathToFolder}`);

    for (const file of files) {
      let contents = readFileSync(`${tmpSprite}/${pathToFolder}/${file}`, {
        encoding: 'utf-8',
      });
      contents = contents
        .replace(/\(.*\.svg\)/g, '')
        .replace(/(?:const|let).*require.*lit.*;/, '');
      writeFileSync(`${tmpSprite}/${pathToFolder}/${file}`, contents);
    }

    const icons = await import(
      `${tmpSprite}/${options.input.replace('.ts', '.js')}`
    );

    console.info(`Convert icons to the correct structure`);
    const svgTemplate = (id, value) => `<symbol id="${id}">${value}</symbol>`;
    const templates = [];

    for (const i in icons) {
      const icon = icons[i];
      templates.push(svgTemplate(icon.type, icon.source));
    }

    console.info(`Generating sprite`);
    const sprites = `<?xml version="1.0" encoding="utf-8"?>
      <svg version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
          ${templates.join('\n')}
      </svg>`;

    console.info(`Collected sprite record`);

    const output = resolve(cwd, options.output);
    if (!existsSync(dirname(output))) {
      mkdirSync(dirname(output), { recursive: true });
    }
    writeFileSync(output, sprites);

    removeTmpDir();

    return { success: true };
  } catch {
    removeTmpDir();

    return { success: false };
  }
}
