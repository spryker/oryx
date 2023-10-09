import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { createServer } from '../../../libs/template/application/server';
import { viteConfig } from '../vite.config.common';

const config = {
  isProd: process.env.NODE_ENV === 'production',
  __dirname: dirname(fileURLToPath(import.meta.url)),
  prod: {
    root: join(viteConfig.monorepoRoot, viteConfig.build.outDirRoot),
    entry: join(
      viteConfig.build.ssr,
      viteConfig.ssr.entry.replace('.ts', '.js')
    ),
    index: viteConfig.build.index,
  },
  dev: {
    root: viteConfig.root,
    entry: join(viteConfig.ssr.root, viteConfig.ssr.entry),
    index: viteConfig.index,
  },
  namespace: viteConfig.ssr.namespace,
};

createServer(config).run();
