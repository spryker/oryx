import {
  intro,
  isCancel,
  log,
  note,
  outro,
  spinner,
  text,
} from '@clack/prompts';
import { inject } from '@spryker-oryx/di';
import fs from 'fs';
import path from 'path';
import c from 'picocolors';
import { CliCommand, CliCommandOption } from '../models';
import { CliArgsService, NodeUtilService } from '../services';

export class CreateCliCommand implements CliCommand {
  protected repoUrl =
    'https://github.com/spryker/composable-frontend/archive/refs/{ref}.zip';
  protected repoRefs = {
    [OryxTemplateRef.Latest]: 'heads/master',
  };
  protected repoPaths = {
    [OryxTemplateRef.Latest]: 'composable-frontend-master',
  };
  protected packageRoot = path.resolve(this.dirPath, '../..');
  protected repoPath = path.resolve(this.packageRoot, 'repo');

  constructor(
    protected argsService = inject(CliArgsService),
    protected nodeUtilService = inject(NodeUtilService),
    protected dirPath = path.resolve(__dirname, '.')
  ) {}

  getName(): string {
    return 'create';
  }

  getAliases(): string[] {
    return ['c'];
  }

  getOptions(): CliCommandOption[] {
    return [{ name: 'name', short: 'n', type: 'string' }];
  }

  getHelp(): string {
    return `
Create a new Oryx app.
Usage: ${c.bold('oryx create')} ${c.dim('[options]')}

Aliases: ${c.bold('c')}

Options:
  ${c.dim('-n, --name')}    The name of the app and the directory to create.
`;
  }

  async execute(): Promise<void> {
    const options: CreateAppOptions = {
      name: this.argsService.get('name') as string,
    };

    await this.createApp(options);
  }

  async createApp(options: CreateAppOptions = {}): Promise<void> {
    console.log(``);
    intro(`Create Oryx App`);

    if (!options.name) {
      options.name = await this.promptName();
    } else {
      log.info(`App name: ${c.bold(options.name)}`);
    }

    const startTime = new Date().getTime();

    const config: CreateAppConfig = {
      ...(options as Required<CreateAppOptions>),
      path: path.resolve(process.cwd(), options.name),
    };

    if (fs.existsSync(config.path)) {
      throw new Error(
        `Directory '${options.name}' already exists!
Please make sure to not use an existing directory name.`
      );
    }

    const s = spinner();

    s.start('Installing application...');
    await this.dowloadTemplate();
    await this.copyTemplate(config);
    s.stop('Application installed');

    await this.npmInstall(config.path);

    const totalTime = (new Date().getTime() - startTime) / 1000;

    note(
      `${c.bold(`cd ${options.name}`)}\n${c.bold('npm run dev')}`,
      'Next steps:'
    );

    outro(`Oryx App "${options.name}" created in ${Math.floor(totalTime)}s`);
  }

  protected async dowloadTemplate(
    ref: OryxTemplateRef = OryxTemplateRef.Latest
  ): Promise<void> {
    const repoPath = path.resolve(this.repoPath, ref);

    if (fs.existsSync(repoPath)) {
      return;
    }

    const archivePath = path.resolve(this.packageRoot, `template-${ref}.zip`);

    if (!fs.existsSync(archivePath)) {
      await this.nodeUtilService.downloadFile(
        this.getTempalteUrl(ref),
        archivePath
      );
    }

    await this.nodeUtilService.extractZip(archivePath, repoPath);
  }

  protected async copyTemplate(
    options: CreateAppConfig,
    ref: OryxTemplateRef = OryxTemplateRef.Latest
  ): Promise<void> {
    const repoPath = path.resolve(this.repoPath, ref, this.repoPaths[ref]);

    if (!fs.existsSync(repoPath)) {
      throw new Error(
        'Application template is not found! Please re-run the command again.'
      );
    }

    await this.nodeUtilService.copyFolder(repoPath, options.path);
  }

  protected async npmInstall(path: string): Promise<void> {
    const s = spinner();

    s.start('Installing dependencies...');
    await this.nodeUtilService.executeCommand('npm install', path);
    s.stop('Dependencies installed');
  }

  protected getTempalteUrl(ref: OryxTemplateRef): string {
    return this.repoUrl.replace('{ref}', this.repoRefs[ref]);
  }

  protected promptName(): Promise<string> {
    return this.promptValue(
      text({
        message: `What is the name of your app?`,
        placeholder: 'oryx-app',
        defaultValue: 'oryx-app',
      })
    );
  }

  protected async promptValue<T>(input: Promise<T | symbol>): Promise<T> {
    const value = await input;

    if (isCancel(value)) {
      return Promise.reject('Operation cancelled.');
    }

    return value;
  }
}

interface CreateAppConfig extends Required<CreateAppOptions> {
  path: string;
}

export interface CreateAppOptions {
  name?: string;
  options?: OryxOption[];
}

export enum OryxTemplateRef {
  Latest = 'latest',
}

export enum OryxOption {
  Labs = 'Labs',
  Ssr = 'SSR',
  Sw = 'service-worker',
  Fa = 'fulfillment-application',
}
