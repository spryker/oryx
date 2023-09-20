import { inject, INJECTOR } from '@spryker-oryx/di';
import c from 'picocolors';
import { CliCommands } from '../commands';
import { CliCommand } from '../models';
import { CliArgsService } from './cli-args.service';

export class CliService {
  constructor(
    protected argsService = inject(CliArgsService),
    protected injector = inject(INJECTOR)
  ) {}

  async run(): Promise<void> {
    const commandName = this.argsService.getCommand();

    if (!commandName) {
      throw new Error(
        `No command specified!
See ${c.bold('help')} for available commands.`
      );
    }

    const command = this.findCommand(commandName);

    if (!command) {
      throw new Error(
        `Unknown command '${c.bold(commandName)}'!
See ${c.bold('help')} for available commands.`
      );
    }

    await command.execute();
  }

  protected findCommand(name: string): CliCommand | undefined {
    return this.getCliCommands().find(
      (c) => c.getName() === name || c.getAliases?.().includes(name)
    );
  }

  protected getCliCommands(): CliCommand[] {
    // Inject commands here to avoid circular dependency
    return this.injector.inject(CliCommands);
  }
}
