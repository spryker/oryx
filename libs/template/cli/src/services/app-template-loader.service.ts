import {inject} from '@spryker-oryx/di';
import path from 'path';
import {NodeUtilService} from './node-util.service';
import {AppTypeOptions} from "../commands";

export class AppTemplateLoaderService {
  protected readonly repoUrl =
    'https://github.com/spryker/composable-frontend/archive/{ref}.zip';

  protected readonly repoRefs = {
    [AppTypeOptions.Storefront]: 'master',
    [AppTypeOptions.Fulfillment]: 'fulfillment',
  };

  protected readonly TemplateRef = {
    [AppTypeOptions.Storefront]: 'latest',
    [AppTypeOptions.Fulfillment]: 'fulfillment',
  };

  constructor(
    protected dirPath = path.resolve(process.cwd()),
    protected nodeUtilService = inject(NodeUtilService),
  ) {}

  async copyTemplate(path: string, ref = this.TemplateRef): Promise<void> {
    await this.downloadTemplate(ref);

    const templatePath = this.getTemplatePath(ref);

    try {
      await this.nodeUtilService.copyFolder(templatePath, path);
    } catch (e) {
      throw new Error(`Failed to copy template: ${e}`);
    }
  }

  async downloadTemplate(ref = this.TemplateRef[AppTypeOptions.Storefront]): Promise<void> {
    const templatePath = this.getTemplatePath(ref);
    const archivePath = this.getArchivePath(ref);

    try {
      await this.nodeUtilService.downloadFile(
        this.getTemplateUrl(ref),
        archivePath
      );
    } catch (e) {
      throw new Error(`Failed to download template: ${e}`);
    }

    try {
      await this.nodeUtilService.extractZip(archivePath, templatePath);
    } catch (e) {
      throw new Error(`Failed to extract template: ${e}`);
    }
  }

  protected getTemplateUrl(ref): string {
    return this.repoUrl.replace('{ref}', this.repoRefs[ref]);
  }

  protected getTemplatePath(ref = this.TemplateRef[AppTypeOptions.Storefront]): Promise<string> {
    return path.resolve(this.getTemplateDir(), ref);
  }

  protected getArchivePath(ref = this.TemplateRef[AppTypeOptions.Storefront]): Promise<string> {
    return path.resolve(this.getTemplateDir(), `template-${ref}.zip`);
  }

  protected getTemplateDir(): Promise<string> {
    return path.resolve(this.dirPath, '.templates');
  }
}
