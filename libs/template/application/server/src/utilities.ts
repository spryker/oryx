import { Request } from 'express';
import { join, resolve } from 'path';
import { ServerConfig, ServerModeConfig } from './server.model';

export const generateUrl = (req: Request): void | URL => {
  const {
    protocol,
    originalUrl,
    headers: { host },
  } = req;

  if (originalUrl.startsWith('/node_modules')) return;

  return new URL(`${protocol}://${host}${originalUrl}`);
};

export const generateModeConfig = (config: ServerConfig): ServerModeConfig => {
  const {
    isProd,
    [isProd ? 'prod' : 'dev']: { root, entry, index },
    __dirname,
    namespace,
  } = config;
  const rootPath = resolve(__dirname, root);

  return {
    rootPath,
    indexPath: join(rootPath, index),
    entryPath: join(rootPath, entry),
    namespace,
  };
};
