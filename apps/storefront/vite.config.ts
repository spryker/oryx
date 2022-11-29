import { join } from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { adjustEnv } from '../../tools/utils/adjustUrlVariable';
import { viteConfig } from './vite.config.common.js';

export default defineConfig((config) => {
  adjustEnv(config);

  return {
    ...(process.env.NODE_ENV === 'production'
      ? {
          mangleProps: /_\$needsHydration/,
          mangleCache: {
            _$needsHydration: '_$AG',
          },
        }
      : {}),
    root: viteConfig.index,
    envDir: viteConfig.root,
    envPrefix: viteConfig.envPrefix,
    build: {
      outDir: join(
        viteConfig.monorepoRoot,
        viteConfig.build.outDirRoot,
        viteConfig.build.index
      ),
      emptyOutDir: true,
    },
    publicDir: '../../../libs/presets/public',
    plugins: [...viteConfig.plugins(), splitVendorChunkPlugin()],
  };
});
