import { resolve } from 'path';
import {
  Node,
  Program,
  SourceFile,
  TransformationContext,
  visitEachChild,
} from 'typescript';
import { pathToFileURL } from 'url';
// @ts-ignore
import { compilerOptions } from '../../../../tsconfig.base.json';

declare module 'typescript' {
  interface Node {
    text?: string;
  }
}

const { paths } = compilerOptions;

export default function pathsReplacer(program: Program) {
  const { rootDir } = program.getCompilerOptions();

  return {
    before(ctx: TransformationContext) {
      return (sourceFile: SourceFile) => {
        const visitor = (node: Node): Node => {
          const path = paths[node?.text];
          const isLit = node?.text === 'lit';
          const resolveLit = isLit
            ? ctx.factory.createStringLiteral(
                pathToFileURL(
                  resolve(
                    rootDir,
                    'tools/executors/generate-icon-sprites/svg-module/mock-svg-lit.ts'
                  )
                ).href
              )
            : node;
          const resolvedNode = path
            ? ctx.factory.createStringLiteral(
                pathToFileURL(resolve(rootDir, path[0])).href
              )
            : resolveLit;

          return visitEachChild(resolvedNode, visitor, ctx);
        };

        return visitEachChild(sourceFile, visitor, ctx);
      };
    },
  };
}
