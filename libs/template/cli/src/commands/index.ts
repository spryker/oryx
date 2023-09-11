import { Provider } from '@spryker-oryx/di';
import { CliCommand } from '../models/index.js';
import { CreateCliCommand } from './create.js';
import { HelpCliCommand } from './help.js';
import { VersionCliCommand } from './version.js';

export * from './create.js';
export * from './help.js';
export * from './version.js';

export const CliCommands = 'oryx.CliCommands*';

declare global {
  interface InjectionTokensContractMap {
    [CliCommands]: CliCommand;
  }
}

export const cliCommandsProviders: Provider[] = [
  { provide: CliCommands, useClass: CreateCliCommand },
  { provide: CliCommands, useClass: HelpCliCommand },
  { provide: CliCommands, useClass: VersionCliCommand },
];
