import { FeatureOptionsService } from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { parseArgs, ParseArgsConfig } from 'node:util';
import { CliCommands } from '../commands/index.js';
import { CliCommand } from '../models/index.js';

export class CliArgsService {
  protected options =
    this.featureOptionsService.getFeatureOptions(CliFeatureOptions);
  protected args = [...(this.options.args ?? [])];
  protected command = this.args.shift() ?? 'create';
  protected parsedArgs?: ReturnType<typeof parseArgs>;

  constructor(
    protected featureOptionsService = inject(FeatureOptionsService),
    protected injector = inject(INJECTOR)
  ) {}

  getRawArgs(): string[] {
    return [...(this.options.args ?? [])];
  }

  getCommand(): string | undefined {
    return this.command;
  }

  getValues(): Readonly<
    Record<string, string | boolean | (string | boolean)[] | undefined>
  > {
    return this.getParsedArgs().values;
  }

  getPositionals(): ReadonlyArray<string> {
    return this.getParsedArgs().positionals;
  }

  get(name: string): string | boolean | (string | boolean)[] | undefined {
    return this.getParsedArgs().values[name];
  }

  has(name: string): boolean {
    return name in this.getParsedArgs().values;
  }

  getPositional(index: number): string | undefined {
    return this.getParsedArgs().positionals[index];
  }

  protected getParsedArgs(): ReturnType<typeof parseArgs> {
    if (!this.parsedArgs) {
      this.parsedArgs = parseArgs({
        allowPositionals: true,
        options: this.getArgsSchemaFor(this.command),
        args: this.args,
        strict: false,
      });
    }

    return this.parsedArgs;
  }

  protected getCliCommands(): CliCommand[] {
    // Inject commands here to avoid circular dependency
    return this.injector.inject(CliCommands);
  }

  protected getArgsSchemaFor(
    commandName?: string
  ): Record<string, NodeArgsConfig> {
    if (!commandName) {
      return {};
    }

    const command = this.getCliCommands().find(
      (command) =>
        command.getName() === commandName ||
        command.getAliases?.().includes(commandName)
    );

    if (!command) {
      return {};
    }

    const options = command.getOptions?.() ?? [];

    return options.reduce((schema, option) => {
      schema[option.name] = {
        type: option.type,
        short: option.short,
        multiple: option.multiple ?? false,
      };

      return schema;
    }, {} as Record<string, NodeArgsConfig>);
  }
}

export interface CliFeatureOptions {
  args?: string[];
}

export const CliFeatureOptions = 'cli';

declare global {
  interface FeatureOptions {
    [CliFeatureOptions]: CliFeatureOptions;
  }
}

type NodeArgsConfig = NonNullable<ParseArgsConfig['options']>[string];
