import {
  intro,
  isCancel,
  log, multiselect,
  note,
  outro, select,
  spinner,
  text,
} from '@clack/prompts';
import { inject } from '@spryker-oryx/di';
import fs from 'fs';
import path from 'path';
import c from 'picocolors';
import { CliCommand, CliCommandOption } from '../models';
import {AppTemplateBuilderService, AppTemplateLoaderService, CliArgsService, NodeUtilService} from '../services';

export class CreateCliCommand implements CliCommand {
  constructor(
    protected argsService = inject(CliArgsService),
    protected appTemplateLoaderService = inject(AppTemplateLoaderService),
    // protected appTemplateBuilderService = inject(AppTemplateBuilderService),
    protected nodeUtilService = inject(NodeUtilService),
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
      { name: 'theme', short: 't', type: 'string' },
      { name: 'feature', short: 'f', type: 'string' },
    ];
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
      appType: this.argsService.get('type') as string,
    };

    await this.createApp(options);
  }

  async createApp(options: CreateAppOptions = {}): Promise<void> {
    console.log(``);
    intro(`Create Oryx App`);

    if (!options.name) {
      options.name = await this.promptName();
    } else {
      log.info(`Application name: ${c.bold(options.name)}`);
    }

    const appPath = path.resolve(process.cwd(), options.name);

    if (fs.existsSync(appPath)) {
      throw new Error(
        `Directory '${options.name}' already exists!
Please make sure to not use an existing directory name.`
      );
    }

    if (!options.appType) {
      options.appType = await this.promptType();
    } else {
      log.info(`Application type: ${c.bold(options.appType)}`);
    }

    if (!options.preset) {
      options.preset = await this.promptPreset();
    } else {
      log.info(`Preset: ${c.bold(options.preset)}`);
    }

    if (!options.feature) {
      options.feature = await this.promptFeature();
    } else {
      log.info(`Features: ${c.bold(options.feature)}`);
    }

    const startTime = new Date().getTime();

    const s = spinner();

    s.start('Copying template...');
    await this.appTemplateLoaderService.copyTemplate(appPath, options.appType);
    s.stop('Template copied');

    // s.start('Configuring application...');
    // const appTemplate = this.appTemplateBuilderService.create(appPath);
    // s.stop('Application configured!');

    // await this.npmInstall(appPath);

    const totalTime = (new Date().getTime() - startTime) / 1000;

    note(
      `${c.bold(`cd ${options.name}`)}\n${c.bold('npm run dev')}`,
      'Next steps:'
    );

    outro(`Oryx App "${options.name}" created in ${Math.floor(totalTime)}s`);
  }

  protected async npmInstall(path: string): Promise<void> {
    const s = spinner();

    s.start('Installing dependencies...');
    await this.nodeUtilService.executeCommand('npm install', path);
    s.stop('Dependencies installed');
  }

  protected promptName(): Promise<string> {
    return this.promptValue(
      text({
        message: `What is the name of your application?`,
        placeholder: 'oryx-app',
        defaultValue: 'oryx-app',
      })
    );
  }

  protected promptType(): Promise<string> {
    return this.promptValue(
      select({
        message: 'Select application type',
        options: [
          { value: AppTypeOptions.Storefront, label: AppTypeOptions.Storefront, hint: 'Default Storefront-oriented setup' },
          { value: AppTypeOptions.Fulfillment, label: AppTypeOptions.Fulfillment, hint: 'PWA setup fpr Fulfillment application' },
        ],
      })
    );
  }

  protected promptPreset(): Promise<string> {
    return this.promptValue(
      select({
        message: 'Select preset',
        options: [
          { value: PresetOptions.B2C, label: PresetOptions.B2C },
          { value: PresetOptions.B2B, label: PresetOptions.B2B },
        ],
      })
    );
  }

  protected promptFeature(): Promise<string> {
    return this.promptValue(
      multiselect({
        message: 'Select features',
        options: [
          { value: FeatureOptions.Labs, label: FeatureOptions.Labs },
        ],
        required: false,
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

export interface CreateAppOptions extends OryxOptions {
  name?: string;
}

export interface OryxOptions {
  appType?: AppTypeOptions,
  preset?: PresetOptions,
  feature?: FeatureOptions,
}

export enum AppTypeOptions {
  Storefront = 'storefront',
  Fulfillment = 'fulfillment',
}

export enum PresetOptions {
  B2C = 'b2c',
  B2B = 'b2b'
}
export enum FeatureOptions {
  Labs = 'labs'
}
