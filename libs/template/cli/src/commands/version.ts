import { intro, log, outro } from '@clack/prompts';
import path from 'path';
import c from 'picocolors';
import url from 'url';
import { CliCommand } from '../models';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const PackageRoot = path.resolve(__dirname, '../..');

export class VersionCliCommand implements CliCommand {
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
    const { version } = await import(
      path.resolve(PackageRoot, './package.json')
    );

    return version;
  }
}
