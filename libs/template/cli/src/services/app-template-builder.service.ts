import { promises as fs } from 'fs';
import path from 'path';
import { Feature, Preset } from '../models';

export class AppTemplateBuilderService {
  create(appPath: string): AppTemplateBuilder {
    return new AppTemplateBuilder(appPath);
  }
}

export class AppTemplateBuilder {
  protected readonly appPath = path.resolve(this.appPath, 'src/app.ts');
  protected features?: Feature[];
  protected preset?: Preset;

  constructor(protected readonly appPath: string) {}

  setPreset(preset: Preset): this {
    this.preset = preset;
    return this;
  }

  setFeatures(features: Feature[]): this {
    this.features = features;
    return this;
  }

  async update(): Promise<void> {
    let appFile = await this.readAppFile();

    appFile = this.updatePreset(appFile);
    appFile = this.updateFeatures(appFile);

    await this.writeAppFile(appFile);
  }

  protected updatePreset(content: string): string {
    if (!this.preset || this.preset === Preset.B2C) {
      return content;
    }

    if (this.preset === Preset.B2B) {
      content = content.replace(
        `import { storefrontFeatures } from '@spryker-oryx/presets/storefront';`,
        `import { b2bStorefrontFeatures } from '@spryker-oryx/presets/b2b-storefront';`
      );

      content = content.replace(
        `.withFeature(storefrontFeatures)`,
        `.withFeature(b2bStorefrontFeatures)`
      );

      return content;
    }

    content = content.replace(
      `import { storefrontFeatures } from '@spryker-oryx/presets/storefront';`,
      `import { ${this.preset}Features } from '@spryker-oryx/presets/${this.preset}';`
    );

    content = content.replace(
      `withFeature(storefrontFeatures)`,
      `.withFeature(${this.preset})`
    );

    return content;
  }

  protected updateFeatures(content: string): string {
    console.log('Features: ', this.features);

    if (!this.features) {
      return content;
    }

    const featuresImports = this.features
      ?.map(
        (feature) =>
          `import { ${feature}Features } from '@spryker-oryx/${feature}';`
      )
      .join('\n');

    const featuresList = this.features
      ?.map((feature) => `.withFeature(${feature}Features)`)
      .join(`\n  `);

    content = `${featuresImports}\n${content}`;

    content = content.replace(
      `appBuilder()`,
      `appBuilder()\n  ${featuresList}`
    );

    return content;
  }

  protected readAppFile(): Promise<string> {
    return fs.readFile(this.appPath, 'utf-8');
  }

  protected writeAppFile(content: string): Promise<void> {
    return fs.writeFile(this.appPath, content);
  }
}
