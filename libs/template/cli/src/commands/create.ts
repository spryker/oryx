import {
  intro,
  isCancel,
  log,
  multiselect,
  note,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import { inject } from '@spryker-oryx/di';
import fs from 'fs';
import path from 'path';
import c from 'picocolors';
import {
  ApplicationType,
  CliCommand,
  CliCommandOption,
  Feature,
  Preset,
} from '../models';
import {
  AppTemplateBuilderService,
  AppTemplateLoaderService,
  CliArgsService,
  NodeUtilService,
} from '../services';
import { ApplicationCliService } from '../services/application-cli.service';

export class CreateCliCommand implements CliCommand {
  constructor(
    protected argsService = inject(CliArgsService),
    protected appTemplateLoaderService = inject(AppTemplateLoaderService),
    protected applicationCliService = inject(ApplicationCliService),
    protected appTemplateBuilderService = inject(AppTemplateBuilderService),
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
      { name: 'theme', short: 't', type: 'string' },
      { name: 'features', short: 'f', type: 'string' },
    ];
  }

  getHelp(): string {
    return `
Create a new Oryx app.
Usage: ${c.bold('oryx create')} ${c.dim('[options]')}

Aliases: ${c.bold('c')}

Options:
  ${c.dim('-n, --name')}    The name of the app and the directory to create.
  ${c.dim('-p, --preset')}  A preset to use.
  ${c.dim('-t, --theme')}   A theme to use.
  ${c.dim('-t, --features')}   A list of features to use.
`;
  }

  async execute(): Promise<void> {
    const options: CreateAppOptions = {
      name: this.argsService.get('name') as string,
      appType: this.argsService.get('type') as string,
      preset: this.argsService.get('preset') as string,
      features: this.argsService.get('features') as string,
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
      options.preset = await this.promptPreset(options.appType);
    } else {
      log.info(`Preset: ${c.bold(options.preset)}`);
    }

    if (!options.features) {
      options.features = await this.promptFeatures(options.appType);
    } else {
      log.info(`Features: ${c.bold(options.features)}`);
    }

    const startTime = new Date().getTime();

    const s = spinner();

    s.start('Copying template...');
    await this.appTemplateLoaderService.copyTemplate(appPath, options.appType);
    s.stop('Template copied');

    s.start('Configuring application...');

    const appTemplate = this.appTemplateBuilderService.create(appPath);

    await appTemplate
      .setPreset(options.preset)
      .setFeatures(options.features)
      .update();

    s.stop('Application configured!');

    await this.npmInstall(appPath);

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
    const types = this.getTypes();

    if (!types.length) {
      throw new Error('No application types found!');
    }

    return this.promptValue(
      select({
        message: 'Select application type',
        options: this.getPromptOptions(types),
      })
    );
  }

  protected promptPreset(
    appType: ApplicationType
  ): Promise<string> | undefined {
    const presets = this.getPresets(appType);

    if (!presets.length) {
      log.info(`No presets found!`);
      return;
    }

    return this.promptValue(
      select({
        message: 'Select preset',
        options: this.getPromptOptions(presets),
      })
    );
  }

  protected promptFeatures(appType: ApplicationType): Promise<string> {
    const features = this.getFeatures(appType);

    if (!features.length) {
      log.info(`No features found!`);
      return;
    }

    return this.promptValue(
      multiselect({
        message: 'Select features',
        options: this.getPromptOptions(features),
        required: false,
      })
    );
  }

  protected getPromptOptions(options: string[]): string[] {
    return options.map((value) => ({
      value,
      label: value,
    }));
  }

  protected async promptValue<T>(input: Promise<T | symbol>): Promise<T> {
    const value = await input;

    if (isCancel(value)) {
      return Promise.reject('Operation cancelled.');
    }

    return value;
  }

  protected getTypes(): string[] {
    return this.applicationCliService.getApplicationTypes();
  }

  protected getPresets(appType: ApplicationType): string[] {
    return this.applicationCliService.getPresets(appType);
  }

  protected getFeatures(appType: ApplicationType): string[] {
    return this.applicationCliService.getFeatures(appType);
  }
}

export interface CreateAppOptions {
  name: string;
  appType: ApplicationType;
  preset?: Preset;
  features?: Feature[];
}
