"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const path_1 = require("path");
const typescript_1 = require("typescript");
// @ts-ignore
const tsconfig_base_json_1 = require("../../../tsconfig.base.json");
const paths = Object.assign(Object.create(null), tsconfig_base_json_1.compilerOptions.paths);
const pathsTransformer = (ctx, options) => {
    const { rootDir, outDir } = options;
    return (sourceFile) => {
        const visitor = (node) => {
            const path = paths[node?.text];
            const isLit = node?.text === 'lit' || node?.text?.startsWith('lit/');
            const resolveLit = isLit
                ? ctx.factory.createStringLiteral((0, path_1.resolve)(rootDir, 'tools/executors/generate-icon-sprites/mock-svg-lit.js'))
                : node;
            const resolvedNode = path
                ? ctx.factory.createStringLiteral((0, path_1.resolve)(rootDir, outDir, path[0].replace('.ts', '.js')))
                : resolveLit;
            return (0, typescript_1.visitEachChild)(resolvedNode, visitor, ctx);
        };
        return (0, typescript_1.visitEachChild)(sourceFile, visitor, ctx);
    };
};
function compile(fileName, options) {
    const program = (0, typescript_1.createProgram)([fileName], options);
    const emitResult = program.emit(undefined, (fileName, content) => {
        typescript_1.sys.writeFile(fileName, `${typescript_1.sys.newLine}${content}`);
    }, undefined, undefined, {
        before: [(ctx) => pathsTransformer(ctx, options)],
    });
    return !emitResult.emitSkipped;
}
exports.compile = compile;
