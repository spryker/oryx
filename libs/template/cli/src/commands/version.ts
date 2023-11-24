import { intro, log, outro } from '@clack/prompts';
import path from 'path';
import c from 'picocolors';
import { CliCommand } from '../models';
import url from "url";

export class VersionCliCommand implements CliCommand {
  protected packagePath = path.resolve(this.dirPath, '../..', 'package.json');

  constructor(protected dirPath = typeof __dirname === 'undefined' ? url.fileURLToPath(new URL('.', import.meta.url)) : path.resolve(__dirname, '.')) {}

  getName(): string {
    return 'version';
  }

  getAliases(): string[] {
    return ['-v', 'v'];
  }

  getHelp(): string {
    return `
Prints the version of the Oryx CLI

Usage:
  ${c.bold('oryx version')}
  ${c.bold('oryx -v')}
  `;
  }

  async execute(): Promise<void> {
    intro(`Oryx CLI`);
    log.info(`Version: ${await this.getVersion()}`);
    outro();
  }

  async getVersion(): Promise<string> {
    const { version } = await import(this.packagePath);

    return version;
  }
}
