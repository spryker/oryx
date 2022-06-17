"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const typescript_1 = require("typescript");
const url_1 = require("url");
// @ts-ignore
const tsconfig_base_json_1 = require("../../../../tsconfig.base.json");
const { paths } = tsconfig_base_json_1.compilerOptions;
function pathsReplacer(program) {
    const { rootDir } = program.getCompilerOptions();
    return {
        before(ctx) {
            return (sourceFile) => {
                const visitor = (node) => {
                    const path = paths[node?.text];
                    const isLit = node?.text === 'lit';
                    const resolveLit = isLit
                        ? ctx.factory.createStringLiteral((0, url_1.pathToFileURL)((0, path_1.resolve)(rootDir, 'tools/executors/generate-icon-sprites/svg-module/mock-svg-lit.ts')).href)
                        : node;
                    const resolvedNode = path
                        ? ctx.factory.createStringLiteral((0, url_1.pathToFileURL)((0, path_1.resolve)(rootDir, path[0])).href)
                        : resolveLit;
                    return (0, typescript_1.visitEachChild)(resolvedNode, visitor, ctx);
                };
                return (0, typescript_1.visitEachChild)(sourceFile, visitor, ctx);
            };
        },
    };
}
exports.default = pathsReplacer;
