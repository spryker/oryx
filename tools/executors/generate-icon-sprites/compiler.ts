import { resolve } from 'path';
import {
  CompilerOptions,
  createProgram,
  Node,
  SourceFile,
  sys,
  TransformationContext,
  visitEachChild,
} from 'typescript';
// @ts-ignore
import { compilerOptions } from '../../../tsconfig.base.json';

const paths = Object.assign(Object.create(null), compilerOptions.paths);

declare module 'typescript' {
  interface Node {
    text?: string;
  }
}

const pathsTransformer = (
  ctx: TransformationContext,
  options: CompilerOptions
) => {
  const { rootDir, outDir } = options;

  return (sourceFile: SourceFile) => {
    const visitor = (node: Node): Node => {
      const path = paths[node?.text];
      const isLit = node?.text === 'lit' || node?.text?.startsWith('lit/');
      const resolveLit = isLit
        ? ctx.factory.createStringLiteral(
            resolve(
              rootDir,
              'tools/executors/generate-icon-sprites/mock-svg-lit.js'
            )
          )
        : node;
      const resolvedNode = path
        ? ctx.factory.createStringLiteral(
            resolve(rootDir, outDir, path[0].replace('.ts', '.js'))
          )
        : resolveLit;

      return visitEachChild(resolvedNode, visitor, ctx);
    };

    return visitEachChild(sourceFile, visitor, ctx);
  };
};

export function compile(fileName: string, options: CompilerOptions): boolean {
  const program = createProgram([fileName], options);
  const emitResult = program.emit(
    undefined,
    (fileName, content) => {
      sys.writeFile(fileName, `${sys.newLine}${content}`);
    },
    undefined,
    undefined,
    {
      before: [(ctx: TransformationContext) => pathsTransformer(ctx, options)],
    }
  );

  return !emitResult.emitSkipped;
}
