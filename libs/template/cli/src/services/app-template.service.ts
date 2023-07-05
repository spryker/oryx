import { promises as fs } from 'fs';
import path from 'path';
import { OryxFeature, OryxIdentifier, OryxTheme } from '../models';

export class AppTemplateFactoryService {
  create(appPath: string): AppTemplateBuilder {
    return new AppTemplateBuilder(appPath);
  }
}

export class AppTemplateBuilder {
  protected readonly mainPath = path.resolve(this.appPath, 'src/main.ts');
  protected features: OryxFeature[] = [];
  protected theme?: OryxTheme;

  constructor(protected readonly appPath: string) {}

  setFeatures(features: OryxFeature[]): this {
    this.features = features;
    return this;
  }

  setTheme(theme: OryxTheme): this {
    this.theme = theme;
    return this;
  }

  async update(): Promise<void> {
    let mainFile = await this.readMainFile();

    mainFile = this.updateFeatures(mainFile);
    mainFile = this.updateTheme(mainFile);

    await this.writeMainFile(mainFile);
  }

  protected updateFeatures(content: string): string {
    const featuresImports = this.features
      .map(
        (feature) =>
          `import { ${feature.identifier} } from '${feature.package}';`
      )
      .join('\n');

    const featuresList = this.features
      .map((feature) => `.withFeature(${this.getIdentifierInstance(feature)})`)
      .join(`\n  `);

    content = content.replace(
      `import { b2cFeatures } from '@spryker-oryx/presets';`,
      `${featuresImports}`
    );

    content = content.replace(`.withFeature(b2cFeatures)`, `${featuresList}`);

    return content;
  }

  protected updateTheme(content: string): string {
    if (!this.theme) {
      return content;
    }

    content = content.replace(
      `import { storefrontTheme } from '@spryker-oryx/themes';`,
      `import { ${this.theme.identifier} } from '${this.theme.package}';`
    );

    content = content.replace(
      `.withTheme(storefrontTheme)`,
      `.withTheme(${this.getIdentifierInstance(this.theme)})`
    );

    return content;
  }

  protected getIdentifierInstance(identifier: OryxIdentifier): string {
    if (identifier.isCallable) {
      return `${identifier.identifier}()`;
    }

    if (identifier.isClass) {
      return `new ${identifier.identifier}()`;
    }

    return identifier.identifier;
  }

  protected readMainFile(): Promise<string> {
    return fs.readFile(this.mainPath, 'utf-8');
  }

  protected writeMainFile(content: string): Promise<void> {
    return fs.writeFile(this.mainPath, content);
  }
}
