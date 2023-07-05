import { readFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import lernaConfig from '../../lerna.json';

const ROOT_PATH = resolve(__dirname, '../..');

const packages = [
  ...lernaConfig.packages.map(
    (pkg) =>
      JSON.parse(readFileSync(resolve(ROOT_PATH, pkg, 'package.json'), 'utf-8'))
        .name as string
  ),
];

export default defineConfig({
  root: '.',
  envPrefix: 'ORYX_',
  build: {
    target: 'node12',
    outDir: '../../../dist/libs/template/cli',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'bin/cli.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: (module: string) =>
        !module.startsWith('@spryker-oryx/cli') &&
        !/^\./.test(module) &&
        !/\.ts$/.test(module),
    },
  },
  define: {
    'import.meta.env.ORYX_PACKAGES': `\`${JSON.stringify(packages)}\``,
  },

  plugins: [
    tsconfigPaths({ root: '../../' }),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.lib.json',
      },
    }),
  ],
});
