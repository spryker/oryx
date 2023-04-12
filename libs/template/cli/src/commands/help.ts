import { intro } from '@clack/prompts';
import { inject, INJECTOR } from '@spryker-oryx/di';
import c from 'picocolors';
import { CliCommands } from '../commands';
import { CliCommand } from '../models';
import { CliArgsService } from '../services';

export class HelpCliCommand implements CliCommand {
  constructor(
    protected argsService = inject(CliArgsService),
    protected injector = inject(INJECTOR)
  ) {}

  getName(): string {
    return 'help';
  }

  getAliases(): string[] {
    return ['h'];
  }

  getHelp(): string {
    return `
Show help for a command.
Usage: ${c.bold('oryx help')} ${c.dim('[command]')}

Aliases: ${c.bold('h')}

Arguments:
  ${c.dim('[command]')}  The command to show help for
`;
  }

  async execute(): Promise<void> {
    const commandName = this.argsService.getPositional(1);

    if (commandName) {
      this.showCommandHelp(commandName);
      return;
    }

    this.showCommandsHelp();
  }

  protected showCommandsHelp(): void {
    intro(`Oryx CLI`);

    console.log(`Available commands:

${this.getCliCommands()
  .map((command) => {
    return `${c.bold(command.getName())}${
      command.getAliases ? ` [${command.getAliases()}]` : ''
    } ${c.dim(`oryx help ${command.getName()}`)}`;
  })
  .join('\n')}
`);
  }

  protected showCommandHelp(commandName: string): void {
    const command = this.getCliCommands().find(
      (command) =>
        command.getName() === commandName ||
        command.getAliases?.().includes(commandName)
    );

    if (!command) {
      throw new Error(`Unknown command '${commandName}'!`);
    }

    intro(`Oryx command: ${command.getName()}`);

    if (command.getHelp) {
      console.log(command.getHelp());
    } else {
      console.log(
        `Sorry, no help available for command '${command.getName()}'`
      );
    }
  }

  protected getCliCommands(): CliCommand[] {
    // Inject commands here to avoid circular dependency
    return this.injector.inject(CliCommands);
  }
}
