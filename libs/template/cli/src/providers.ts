import { Provider } from '@spryker-oryx/di';
import { cliCommandsProviders } from './commands';
import {
  AppTemplateBuilderService,
  AppTemplateLoaderService,
  CliArgsService,
  CliService,
  NodeUtilService,
} from './services';
import { ApplicationCliService } from './services/application-cli.service';

export const cliProviders: Provider[] = [
  { provide: CliService, useClass: CliService },
  { provide: CliArgsService, useClass: CliArgsService },
  { provide: NodeUtilService, useClass: NodeUtilService },
  { provide: AppTemplateLoaderService, useClass: AppTemplateLoaderService },
  { provide: AppTemplateBuilderService, useClass: AppTemplateBuilderService },
  { provide: ApplicationCliService, useClass: ApplicationCliService },
  ...cliCommandsProviders,
];
