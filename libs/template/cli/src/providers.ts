import { Provider } from '@spryker-oryx/di';
import { cliCommandsProviders } from './commands';
import {
  AppTemplateFactoryService,
  CliArgsService,
  CliService,
  FeaturesService,
  NodeUtilService,
  PackagesService,
  TemplateLoaderService,
  ThemesService,
} from './services';

export const cliProviders: Provider[] = [
  { provide: CliService, useClass: CliService },
  { provide: CliArgsService, useClass: CliArgsService },
  { provide: NodeUtilService, useClass: NodeUtilService },
  { provide: PackagesService, useClass: PackagesService },
  { provide: FeaturesService, useClass: FeaturesService },
  { provide: ThemesService, useClass: ThemesService },
  { provide: TemplateLoaderService, useClass: TemplateLoaderService },
  { provide: AppTemplateFactoryService, useClass: AppTemplateFactoryService },
  ...cliCommandsProviders,
];
