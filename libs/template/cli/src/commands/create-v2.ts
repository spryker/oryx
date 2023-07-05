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
import { promises as fs } from 'fs';
import path from 'path';
import c from 'picocolors';
import { firstValueFrom } from 'rxjs';
import {
  CliCommand,
  CliCommandOption,
  OryxFeature,
  OryxTheme,
} from '../models';
import {
  AppTemplateFactoryService,
  CliArgsService,
  FeaturesService,
  TemplateLoaderService,
  ThemesService,
} from '../services';

export class CreateV2CliCommand implements CliCommand {
  constructor(
    protected readonly argsService = inject(CliArgsService),
    protected readonly featuresService = inject(FeaturesService),
    protected readonly themesService = inject(ThemesService),
    protected readonly templateLoaderService = inject(TemplateLoaderService),
    protected readonly appTemplateFactoryService = inject(
      AppTemplateFactoryService
    )
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
    ];
  }

  async getHelp(): Promise<string> {
    return `
Create a new Oryx app.
Usage: ${c.bold('oryx create')} ${c.dim('[options]')}

Aliases: ${c.bold('c')}

Options:
  ${c.dim('-n, --name')}    A name of the app and the directory to create.
  ${c.dim('-p, --preset')}  A preset to use. Possible values: ${Object.values(
      (await this.getPresetFeatures()).map((f) => f.id)
    ).join(', ')}
  ${c.dim('-t, --theme')}   A theme to use. Possible values: ${Object.values(
      (await this.getThemes()).map((f) => f.id)
    ).join(', ')}
`;
  }

  async execute(): Promise<void> {
    const options: CreateAppOptions = {
      name: this.argsService.get('name') as string,
      preset: this.argsService.get('preset') as string,
      theme: this.argsService.get('theme') as string,
    };

    await this.createApp(options);
  }

  async createApp(options: CreateAppOptions = {}): Promise<void> {
    intro(`Create Oryx App`);

    if (!options.name) {
      options.name = await this.promptName();
    } else {
      log.info(`App name: ${c.bold(options.name)}`);
    }

    const appPath = path.resolve(process.cwd(), options.name);

    if (await fs.stat(appPath)) {
      throw new Error(
        `Directory '${options.name}' already exists!
Please make sure to not use an existing directory name.`
      );
    }

    if (!options.preset) {
      options.preset = await this.promptPreset();
    } else {
      log.info(`Preset: ${c.bold(options.preset)}`);
    }

    if (!options.theme) {
      options.theme = await this.promptTheme();
    } else {
      log.info(`Theme: ${c.bold(options.theme)}`);
    }

    const s = spinner();

    s.start('Copying template...');

    await this.templateLoaderService.copyTemplate(appPath);

    s.stop('Template copied!');

    s.start('Configuring application...');

    const appTemplate = this.appTemplateFactoryService.create(appPath);
    const presetFeature = await this.getPresetFeature(options.preset);
    const theme = await this.getTheme(options.theme);

    await appTemplate.setFeatures([presetFeature]).setTheme(theme).update();

    s.stop('Application configured!');

    outro(`Created Oryx App ${options.name}!`);
  }

  protected getPresetFeatures(): Promise<OryxFeature[]> {
    return firstValueFrom(this.featuresService.getPresets());
  }

  protected getThemes(): Promise<OryxTheme[]> {
    return firstValueFrom(this.themesService.getThemes());
  }

  protected async getPresetFeature(preset: string): Promise<OryxFeature> {
    const presetFeatures = await this.getPresetFeatures();
    const presetFeature = presetFeatures.find(
      (feature) => feature.id === preset && feature.isPreset
    );

    if (!presetFeature) {
      throw new Error(
        `Preset '${preset}' does not exist!
Please choose one of: ${presetFeatures.map((feature) => feature.id).join(', ')}`
      );
    }

    return presetFeature;
  }

  protected async getTheme(theme: string): Promise<OryxTheme> {
    const themes = await this.getThemes();

    const themeFeature = themes.find((t) => t.id === theme);

    if (!themeFeature) {
      throw new Error(
        `Theme '${theme}' does not exist!
Please choose one of: ${themes.map((t) => t.id).join(', ')}`
      );
    }

    return themeFeature;
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

  protected async promptPreset(): Promise<string> {
    const presetFeatures = await this.getPresetFeatures();

    if (!presetFeatures.length) {
      throw new Error('No presets found!');
    }

    return this.promptValue(
      select({
        message: `Which preset would you like to use? ${c.dim(
          `[--preset, -p]`
        )}`,
        initialValue: presetFeatures.find((feature) =>
          feature.id.includes('b2c')
        )?.id,
        options: presetFeatures.map((feature) => ({
          value: feature.id,
          label: feature.name,
          hint: feature.description,
        })),
      })
    );
  }

  protected async promptTheme(): Promise<string> {
    const themes = await this.getThemes();

    if (!themes.length) {
      throw new Error('No themes found!');
    }

    return this.promptValue(
      select({
        message: `Which theme would you like to use? ${c.dim(`[--theme, -t]`)}`,
        options: themes.map((theme) => ({
          value: theme.id,
          label: theme.name,
          hint: theme.description,
        })),
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

export interface CreateAppOptions {
  name?: string;
  preset?: string;
  theme?: string;
}
