import { join } from 'path';
import {
  Node,
  Program,
  SourceFile,
  TransformationContext,
  visitEachChild,
} from 'typescript';
// @ts-ignore
import { compilerOptions } from '../../../../tsconfig.base.json';

declare module 'typescript' {
  interface Node {
    text?: string;
  }
}

const { paths } = compilerOptions;

export default function pathsReplacer(program: Program) {
  return {
    before(ctx: TransformationContext) {
      return (sourceFile: SourceFile) => {
        const visitor = (node: Node): Node => {
          const path = paths[node?.text];
          const isLit = node?.text === 'lit';
          const { rootDir } = program.getCompilerOptions();
          const resolveLit = isLit
            ? ctx.factory.createStringLiteral(
                join(
                  rootDir,
                  '/tools/executors/generate-icon-sprites/svg-module/mock-svg-lit.ts'
                )
              )
            : node;
          const resolvedNode = path
            ? ctx.factory.createStringLiteral(join(rootDir, path[0]))
            : resolveLit;

          return visitEachChild(resolvedNode, visitor, ctx);
        };

        return visitEachChild(sourceFile, visitor, ctx);
      };
    },
  };
}
