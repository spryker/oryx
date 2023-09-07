import {
  intro,
  isCancel,
  log,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import { inject } from '@spryker-oryx/di';
import fs from 'fs';
import path from 'path';
import c from 'picocolors';
import url from 'url';
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
    protected dirPath = url.fileURLToPath(new URL('.', import.meta.url))
  ) {}

  getName(): string {
    return 'create';
  }

  getAliases(): string[] {
    return ['c'];
  }

  getOptions(): CliCommandOption[] {
    return [
      { name: 'name', short: 'n', type: 'string' },
      { name: 'preset', short: 'p', type: 'string' },
    ];
  }

  getHelp(): string {
    return `
Create a new Oryx app.
Usage: ${c.bold('oryx create')} ${c.dim('[options]')}

Aliases: ${c.bold('c')}

Options:
  ${c.dim('-n, --name')}    The name of the app and the directory to create.
  ${c.dim('-p, --preset')}  The preset to use. Possible values: ${Object.values(
      OryxPreset
    ).join(', ')}
`;
  }

  async execute(): Promise<void> {
    const options: CreateAppOptions = {
      name: this.argsService.get('name') as string,
      preset: this.argsService.get('preset') as OryxPreset,
    };

    if (options.preset && !Object.values(OryxPreset).includes(options.preset)) {
      throw new Error(
        `Unknown preset '${options.preset}'!
Possible values: ${Object.values(OryxPreset).join(', ')}`
      );
    }

    await this.createApp(options);
  }

  async createApp(options: CreateAppOptions = {}): Promise<void> {
    intro(`Create Oryx App`);

    if (!options.name) {
      options.name = await this.promptName();
    } else {
      log.info(`App name: ${c.bold(options.name)}`);
    }

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

    await this.dowloadTemplate();
    await this.copyTemplate(config);

    outro(`Created Oryx App ${options.name}!`);
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
      const s = spinner();

      s.start('Downloading latest template...');

      await this.nodeUtilService.downloadFile(
        this.getTempalteUrl(ref),
        archivePath
      );

      s.stop('Template downloaded!');
    }

    const s = spinner();

    s.start('Extracting template...');

    await this.nodeUtilService.extractZip(archivePath, repoPath);

    s.stop('Template extracted!');
  }

  protected async copyTemplate(
    options: CreateAppConfig,
    ref: OryxTemplateRef = OryxTemplateRef.Latest
  ): Promise<void> {
    const s = spinner();

    s.start('Copying template...');

    const repoPath = path.resolve(this.repoPath, ref, this.repoPaths[ref]);

    if (!fs.existsSync(repoPath)) {
      throw new Error(
        'Template is not found! Please re-run the command again.'
      );
    }

    await this.nodeUtilService.copyFolder(repoPath, options.path);

    s.stop('Template copied!');
  }

  protected getTempalteUrl(ref: OryxTemplateRef): string {
    return this.repoUrl.replace('{ref}', this.repoRefs[ref]);
  }

  protected getTemplateFolder(preset: OryxPreset): string {
    switch (preset) {
      case OryxPreset.B2C:
        return 'storefront';
      case OryxPreset.Fulfillment:
        return 'fulfillment';
    }
  }

  protected promptName(): Promise<string> {
    return this.promptValue(
      text({
        message: `What is the name of your app? ${c.dim(`[--name, -n]`)}`,
        validate: (value) => {
          if (!value.trim()) {
            return 'Please enter a name';
          }
          return undefined;
        },
      })
    );
  }

  protected promptPreset(): Promise<OryxPreset> {
    return this.promptValue(
      select({
        message: `Which preset would you like to use? ${c.dim(
          `[--preset, -p]`
        )}`,
        initialValue: OryxPreset.B2C as OryxPreset,
        options: [
          {
            value: OryxPreset.B2C,
            label: 'B2C',
            hint: 'For standard B2C based storefronts',
          },
          {
            value: OryxPreset.Fulfillment,
            label: 'Fulfillment',
            hint: 'For fulfillment related applications',
          },
        ],
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
  preset?: OryxPreset;
  options?: OryxOption[];
}

export enum OryxPreset {
  B2C = 'b2c',
  B2B = 'b2b',
  Fulfillment = 'fulfillment',
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
