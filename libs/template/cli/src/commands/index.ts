import { Provider } from '@spryker-oryx/di';
import { CliCommand } from '../models';
import { CreateCliCommand } from './create';
import { HelpCliCommand } from './help';

export * from './create';
export * from './help';

export const CliCommands = 'oryx.CliCommands*';

declare global {
  interface InjectionTokensContractMap {
    [CliCommands]: CliCommand;
  }
}

export const cliCommandsProviders: Provider[] = [
  { provide: CliCommands, useClass: CreateCliCommand },
  { provide: CliCommands, useClass: HelpCliCommand },
];
