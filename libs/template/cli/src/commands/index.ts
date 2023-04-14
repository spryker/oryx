import { Provider } from '@spryker-oryx/di';
import { CliCommand } from '../models';
import { CreateCliCommand } from './create';
import { HelpCliCommand } from './help';
import { VersionCliCommand } from './version';

export * from './create';
export * from './help';
export * from './version';

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
