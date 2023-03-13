import express, { Express } from 'express';

import { createDevSever } from './server.dev';
import { ServerConfig } from './server.model';
import { createProdSever } from './server.prod';
import { generateModeConfig } from './utilities';

interface CreateServer {
  app: Express;
  run: () => Promise<void>;
}

export function createServer(config: ServerConfig): CreateServer {
  const app = express();
  const modeConfig = generateModeConfig(config);
  const server = config.isProd ? createProdSever : createDevSever;

  return {
    app,
    run: async (): Promise<void> => {
      await server(app, modeConfig);

      app.listen(config.port ?? 3001, () => {
        console.log(`listening on port ${config.port ?? 3001}`);
      });
    },
  };
}
