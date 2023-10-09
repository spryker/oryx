import { ExecutorContext } from '@nx/devkit';
import { existsSync, mkdirSync, rmdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { ModuleKind, ScriptTarget } from 'typescript';
// @ts-ignore
import { compilerOptions } from '../../../tsconfig.base.json';
import { sortObjectByKeys } from '../../utils';
import { compile } from './compiler';

interface Options {
  iconSets: {
    input: string;
    output: string;
  }[];
}

export default async function echoExecutor(
  options: Options,
  context: ExecutorContext
) {
  const cwd = context.workspace.projects[context.projectName].root;
  const outDir = 'dist-sprites';
  const { iconSets } = options;

  for (let i = 0; i < iconSets.length; i++) {
    const entry = iconSets[i];
    const input = resolve(cwd, entry.input);
    const output = resolve(cwd, entry.output);
    const compiled = resolve(outDir, cwd, entry.input.replace('.ts', '.js'));
    const isEmitted = compile(input, {
      target: ScriptTarget.ES2020,
      module: ModuleKind.CommonJS,
      skipLibCheck: true,
      outDir,
      rootDir: '.',
      experimentalDecorators: true,
      ...compilerOptions,
    });

    if (!isEmitted) {
      console.error(`Error while compiling ${input} input`);

      return { success: false };
    }

    const unsortedIcons = await import(compiled);
    const icons = sortObjectByKeys(unsortedIcons);
    const svgTemplate = (id: string, value: string) =>
      `<symbol id="${id}">${value}</symbol>`;

    const aliasTemplate = (id: string, alias: string) =>
      `<symbol id="${id}"><use href="#${alias}"/></symbol>`;

    const spriteTemplate = (
      sprites: string[]
    ) => `<?xml version="1.0" encoding="utf-8"?>
      <svg version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
          ${sprites.join('\n')}
      </svg>`;
    const templates = [];

    console.info(`Converting icons to the correct structure`);

    for (const i in icons) {
      const icon = icons[i];
      if (icon.alias) {
        templates.push(aliasTemplate(icon.type, icon.alias));
      } else {
        templates.push(svgTemplate(icon.type, icon.source.join('')));
      }
    }

    if (!existsSync(dirname(output))) {
      mkdirSync(dirname(output), { recursive: true });
    }

    console.info(`Generating sprite for ${input}`);

    writeFileSync(output, spriteTemplate(templates));

    if (existsSync(outDir)) {
      rmdirSync(outDir, { recursive: true });
    }
  }

  return { success: true };
}
