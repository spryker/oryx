export interface ServerMode {
  root: string;
  entry: string;
  index: string;
}

export interface ServerConfig {
  isProd: boolean;
  prod: ServerMode;
  dev: ServerMode;
  __dirname: string;
  component: string;
  namespace?: string;
  port?: number;
}

export interface ServerModeConfig {
  indexPath: string;
  rootPath: string;
  entryPath: string;
  namespace?: string;
  component: string;
}
