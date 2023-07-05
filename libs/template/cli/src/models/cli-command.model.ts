export interface CliCommand {
  getName(): string;
  getAliases?(): string[];
  getOptions?(): CliCommandOption[];
  execute(): Promise<void>;
  getHelp?(): string | Promise<string>;
}

export interface CliCommandOption {
  name: string;
  type: 'string' | 'boolean';
  short?: string;
  multiple?: boolean;
}
