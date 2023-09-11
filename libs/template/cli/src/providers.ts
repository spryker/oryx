import { Provider } from '@spryker-oryx/di';
import { cliCommandsProviders } from './commands/index.js';
import {
  CliArgsService,
  CliService,
  NodeUtilService,
} from './services/index.js';

export const cliProviders: Provider[] = [
  { provide: CliService, useClass: CliService },
  { provide: CliArgsService, useClass: CliArgsService },
  { provide: NodeUtilService, useClass: NodeUtilService },
  ...cliCommandsProviders,
];
