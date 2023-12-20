import { Provider } from '@spryker-oryx/di';
import { cliCommandsProviders } from './commands';
import {AppTemplateBuilderService, AppTemplateLoaderService, CliArgsService, CliService, NodeUtilService} from './services';

export const cliProviders: Provider[] = [
  { provide: CliService, useClass: CliService },
  { provide: CliArgsService, useClass: CliArgsService },
  { provide: NodeUtilService, useClass: NodeUtilService },
  { provide: AppTemplateLoaderService, useClass: AppTemplateLoaderService },
  { provide: AppTemplateBuilderService, useClass: AppTemplateBuilderService },
  ...cliCommandsProviders,
];
