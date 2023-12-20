"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const typescript_1 = require("typescript");
// @ts-ignore
const tsconfig_base_json_1 = require("../../../tsconfig.base.json");
const utils_1 = require("../../utils");
const compiler_1 = require("./compiler");
async function echoExecutor(options, context) {
    const cwd = context.workspace.projects[context.projectName].root;
    const outDir = 'dist-sprites';
    const { iconSets } = options;
    for (let i = 0; i < iconSets.length; i++) {
        const entry = iconSets[i];
        const input = (0, path_1.resolve)(cwd, entry.input);
        const output = (0, path_1.resolve)(cwd, entry.output);
        const compiled = (0, path_1.resolve)(outDir, cwd, entry.input.replace('.ts', '.js'));
        const isEmitted = (0, compiler_1.compile)(input, {
            target: typescript_1.ScriptTarget.ES2020,
            module: typescript_1.ModuleKind.CommonJS,
            skipLibCheck: true,
            outDir,
            rootDir: '.',
            experimentalDecorators: true,
            ...tsconfig_base_json_1.compilerOptions,
        });
        if (!isEmitted) {
            console.error(`Error while compiling ${input} input`);
            return { success: false };
        }
        const unsortedIcons = await import(compiled);
        const icons = (0, utils_1.sortObjectByKeys)(unsortedIcons);
        const svgTemplate = (id, value) => `<symbol id="${id}">${value}</symbol>`;
        const aliasTemplate = (id, alias) => `<symbol id="${id}"><use href="#${alias}"/></symbol>`;
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
            if (icon.alias) {
                templates.push(aliasTemplate(icon.type, icon.alias));
            }
            else {
                templates.push(svgTemplate(icon.type, icon.source.join('')));
            }
        }
        if (!(0, fs_1.existsSync)((0, path_1.dirname)(output))) {
            (0, fs_1.mkdirSync)((0, path_1.dirname)(output), { recursive: true });
        }
        console.info(`Generating sprite for ${input}`);
        (0, fs_1.writeFileSync)(output, spriteTemplate(templates));
        if ((0, fs_1.existsSync)(outDir)) {
            (0, fs_1.rmdirSync)(outDir, { recursive: true });
        }
    }
    return { success: true };
}
exports.default = echoExecutor;
//# sourceMappingURL=svg.js.map