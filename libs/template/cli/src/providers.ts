import { Provider } from '@spryker-oryx/di';
import { cliCommandsProviders } from './commands';
import { CliArgsService, CliService, NodeUtilService } from './services';

export const cliProviders: Provider[] = [
  { provide: CliService, useClass: CliService },
  { provide: CliArgsService, useClass: CliArgsService },
  { provide: NodeUtilService, useClass: NodeUtilService },
  ...cliCommandsProviders,
];
