import { Provider } from '@spryker-oryx/di';
import { CliCommand } from '../models';
import { CreateV2CliCommand } from './create-v2';
import { HelpCliCommand } from './help';
import { VersionCliCommand } from './version';

export * from './create-v2';
export * from './help';
export * from './version';

export const CliCommands = 'oryx.CliCommands*';

declare global {
  interface InjectionTokensContractMap {
    [CliCommands]: CliCommand;
  }
}

export const cliCommandsProviders: Provider[] = [
  { provide: CliCommands, useClass: CreateV2CliCommand },
  { provide: CliCommands, useClass: HelpCliCommand },
  { provide: CliCommands, useClass: VersionCliCommand },
];
