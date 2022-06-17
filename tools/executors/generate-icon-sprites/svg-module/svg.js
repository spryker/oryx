"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const url_1 = require("url");
require("./mock-svg-lit");
async function svgSprite() {
    const argvs = process.argv.slice(2);
    const iconSets = JSON.parse(argvs[0].replace('--iconSets=', '').replaceAll(`""`, '"'));
    const cwd = argvs[1].replace('--cwd=', '');
    for (let i = 0; i < iconSets.length; i++) {
        const options = iconSets[i];
        console.info(`Getting the location of icon files`);
        const input = (0, url_1.pathToFileURL)((0, path_1.resolve)(cwd, options.input)).href;
        const output = (0, path_1.resolve)(cwd, options.output);
        const icons = await Promise.resolve().then(() => require(input));
        const svgTemplate = (id, value) => `<symbol id="${id}">${value}</symbol>`;
        const spriteTemplate = (sprites) => `<?xml version="1.0" encoding="utf-8"?>
      <svg version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
          ${sprites.join('\n')}
      </svg>`;
        const templates = [];
        console.info(`Converting icons to the correct structure`);
        for (const i in icons) {
            const icon = icons[i];
            templates.push(svgTemplate(icon.type, icon.source));
        }
        if (!(0, fs_1.existsSync)((0, path_1.dirname)(output))) {
            (0, fs_1.mkdirSync)((0, path_1.dirname)(output), { recursive: true });
        }
        console.info(`Generating sprite`);
        (0, fs_1.writeFileSync)(output, spriteTemplate(templates));
    }
}
svgSprite();
