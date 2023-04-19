import {
  cancel,
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

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export class CreateCliCommand implements CliCommand {
  protected repoUrl = 'https://github.com/spryker/oryx/archive/refs/{ref}.zip';
  protected repoRefs = {
    [OryxTemplateRef.Latest]: 'heads/development',
  };
  protected repoPaths = {
    [OryxTemplateRef.Latest]: 'oryx-development',
  };
  protected packageRoot = path.resolve(__dirname, '../..');
  protected repoPath = path.resolve(this.packageRoot, './repo');

  constructor(
    protected argsService = inject(CliArgsService),
    protected nodeUtilService = inject(NodeUtilService)
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

    if (!options.preset) {
      options.preset = await this.promptPreset();
    } else {
      log.info(`Preset: ${c.bold(options.preset)}`);
    }

    if (fs.existsSync(options.name)) {
      throw new Error(
        `Directory '${options.name}' already exists!
Please make sure to not use an existing directory name.`
      );
    }

    await this.dowloadTemplate();
    await this.copyTemplate(options as Required<CreateAppOptions>);

    outro(`Created Oryx App ${options.name}!`);
  }

  protected async dowloadTemplate(
    ref: OryxTemplateRef = OryxTemplateRef.Latest
  ): Promise<void> {
    const repoPath = path.resolve(this.repoPath, ref);

    if (fs.existsSync(repoPath)) {
      return;
    }

    const archivePath = path.resolve(this.packageRoot, `./template-${ref}.zip`);

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
    options: Required<CreateAppOptions>,
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

    const appPath = path.resolve(process.cwd(), options.name);
    const templatePath = path.resolve(
      repoPath,
      'apps',
      this.getTemplateFolder(options.preset)
    );

    await this.nodeUtilService.copyFolder(templatePath, appPath);

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
          if (!value) {
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

  protected async promptValue<T>(
    input: Promise<T | symbol>
  ): Promise<Exclude<T, symbol>> {
    const value = await input;
    this.handleCancel(value);
    return value;
  }

  protected handleCancel<T>(
    value: T | symbol
  ): asserts value is Exclude<T, symbol> {
    if (isCancel(value)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }
  }
}

export interface CreateAppOptions {
  name?: string;
  preset?: OryxPreset;
}

export enum OryxPreset {
  B2C = 'b2c',
  Fulfillment = 'fulfillment',
}

export enum OryxTemplateRef {
  Latest = 'latest',
}
