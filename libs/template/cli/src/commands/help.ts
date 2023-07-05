import { intro, log, outro } from '@clack/prompts';
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

  async execute(): Promise<void> {
    const commandName = this.argsService.getPositional(0);

    if (commandName) {
      return await this.showCommandHelp(commandName);
    }

    this.showCommandsHelp();
  }

  showCommandsHelp(): void {
    intro(`Oryx CLI`);

    log.message(`Available commands:

${this.getCliCommandsWithHelp()
  .map((command) => {
    return `${c.bold(command.getName())} ${c.dim(
      `oryx help ${command.getName()}`
    )}`;
  })
  .join('\n')}
`);

    outro();
  }

  async showCommandHelp(commandName: string): Promise<void> {
    const command = this.getCliCommandsWithHelp().find(
      (command) =>
        command.getName() === commandName ||
        command.getAliases?.().includes(commandName)
    );

    if (!command) {
      throw new Error(`Unknown command '${commandName}'!`);
    }

    intro(`Oryx command: ${command.getName()}`);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    log.message(await command.getHelp!());

    outro();
  }

  protected getCliCommandsWithHelp(): CliCommand[] {
    // Inject commands here to avoid circular dependency
    return this.injector
      .inject(CliCommands)
      .filter((command) => !!command.getHelp);
  }
}
