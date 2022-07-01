import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { pathToFileURL } from 'url';
import { IconSet } from '../svg';
import './mock-svg-lit';

async function svgSprite() {
  const argvs = process.argv.slice(2);
  const iconSets: IconSet[] = JSON.parse(
    argvs[0].replace('--iconSets=', '').replaceAll(`""`, '"')
  );
  const cwd = argvs[1].replace('--cwd=', '');

  for (let i = 0; i < iconSets.length; i++) {
    const options = iconSets[i];
    console.info(`Getting the location of icon files`);
    const input = pathToFileURL(resolve(cwd, options.input)).href;
    const output = resolve(cwd, options.output);
    const icons = await import(input);
    const svgTemplate = (id: string, value: string) =>
      `<symbol id="${id}">${value}</symbol>`;
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
      templates.push(svgTemplate(icon.type, icon.source.join('')));
    }

    if (!existsSync(dirname(output))) {
      mkdirSync(dirname(output), { recursive: true });
    }

    console.info(`Generating sprite`);
    writeFileSync(output, spriteTemplate(templates));
  }
}

svgSprite();
