import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import * as cypress from 'cypress';
import * as path from 'path';
import { basename, dirname } from 'path';
import {
  InlineConfig,
  PreviewServer,
  ViteDevServer,
  build,
  createServer,
  preview,
} from 'vite';
import * as istanbul from 'vite-plugin-istanbul';
import CypressRunResult = CypressCommandLine.CypressRunResult;
import CypressFailedRunResult = CypressCommandLine.CypressFailedRunResult;

export interface CypressViteExecutorOptions {
  cypress: {
    browser?: string;
    configFile?: string;
    key?: string;
    record?: boolean;
    watch?: boolean;
  };
  vite: {
    configFile: string;
    devServer?: boolean;
    mode?: string;
    port?: number;
    root: string;
  };
}

enum BUILD_MODE_MAP {
  development = 'development',
  production = 'production',
  ci = 'ci',
  test = 'test',
}

export default async function cypressViteExecutor(
  options: CypressViteExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const cypressConfig = {
    ...options.cypress,
    project: dirname(options.cypress?.configFile),
    configFile: basename(options.cypress.configFile),
  };

  const isViteDevServer = options.vite?.devServer;
  const viteConfigFile = options.vite?.configFile;
  const viteMode =
    options.vite?.mode && BUILD_MODE_MAP[options.vite?.mode]
      ? options.vite?.mode
      : 'development';
  const vitePort = options.vite?.port || 4200;
  const viteRoot = options.vite?.root || './';

  const serverConfig = {
    configFile: viteConfigFile,
    mode: viteMode,
    root: viteRoot,
    server: {
      port: vitePort,
    },
    preview: {
      port: vitePort,
    },
    plugins: [
      // @ts-ignore
      istanbul({
        cwd: path.resolve(context.root, ...viteRoot.split('/')),
        include: ['**/*.js', '**/*.ts'],
        extension: ['.js', '.ts'],
        exclude: ['**/*.spec.js', '**/*.spec.ts'],
        cypress: true,
        requireEnv: false,
      }),
    ],
  };

  const server = new ViteServer(serverConfig, isViteDevServer);

  await server.createServer();

  server.getServer().printUrls();

  const result = await (options.cypress?.watch
    ? cypress.open(cypressConfig)
    : cypress.run(cypressConfig));

  await server.close();

  return {
    success:
      !(result as CypressRunResult)?.totalFailed &&
      !(result as CypressFailedRunResult)?.failures,
  };
}

class ViteServer {
  protected server: ViteDevServer | PreviewServer;
  protected config: InlineConfig;
  protected isDevServer = false;

  constructor(config = {}, isDevServer = false) {
    this.server = undefined;
    this.config = config;
    this.isDevServer = isDevServer;
  }

  async createServer() {
    if (this.isDevServer) {
      this.server = await createServer(this.config);
      await (this.server as ViteDevServer).listen();
    } else {
      await build({
        configFile: this.config.configFile,
        mode: this.config.mode,
        root: this.config.root,
      });

      this.server = await preview(this.config);
    }
  }

  getServer() {
    if (!this.server) {
      throw new Error('Server is not set');
    }

    return this.server;
  }

  async close() {
    if (this.isDevServer) {
      await (this.getServer() as ViteDevServer).close();
    } else {
      await this.getServer().httpServer.close();
    }
  }
}
