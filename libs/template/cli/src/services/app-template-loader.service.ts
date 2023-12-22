import { inject } from '@spryker-oryx/di';
import fs from 'fs';
import path from 'path';
import { ApplicationType } from '../models';
import { NodeUtilService } from './node-util.service';

export class AppTemplateLoaderService {
  protected repoName = 'oryx-starter';
  protected readonly repoUrl =
    'https://github.com/spryker/oryx-starter/archive/{ref}.zip';

  protected readonly repoRefs = {
    [ApplicationType.Storefront]: 'master',
    [ApplicationType.Fulfillment]: 'fulfillment',
  };

  protected readonly templateRef = {
    [ApplicationType.Storefront]: 'latest',
    [ApplicationType.Fulfillment]: 'fulfillment',
  };

  constructor(
    protected dirPath = path.resolve(process.cwd()),
    protected nodeUtilService = inject(NodeUtilService)
  ) {}

  async copyTemplate(path: string, ref = this.templateRef): Promise<void> {
    console.log('downloadTemplate');
    await this.downloadTemplate(ref);
    console.log('copyTemplate');

    const templatePath = this.getTemplateRepoPath(ref);

    try {
      await this.nodeUtilService.copyFolder(templatePath, path);
    } catch (e) {
      throw new Error(`Failed to copy template: ${e}`);
    }
  }

  async downloadTemplate(
    ref = this.templateRef[ApplicationType.Storefront]
  ): Promise<void> {
    const templateDir = this.getTemplateDir();
    const templatePath = this.getTemplatePath(ref);
    const archivePath = this.getArchivePath(ref);

    if (!(await fs.existsSync(templateDir))) {
      await this.nodeUtilService.createFolder(templateDir);
    }

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

  protected getTemplateUrl(ref: string): string {
    return this.repoUrl.replace('{ref}', this.repoRefs[ref]);
  }

  protected getTemplateRepoPath(ref: string): string {
    return path.resolve(
      this.getTemplateDir(),
      ref,
      `${this.repoName}-${this.repoRefs[ref]}`
    );
  }

  protected getTemplatePath(
    ref = this.templateRef[ApplicationType.Storefront]
  ): string {
    return path.resolve(this.getTemplateDir(), ref);
  }

  protected getArchivePath(
    ref = this.templateRef[ApplicationType.Storefront]
  ): string {
    return path.resolve(this.getTemplateDir(), `template-${ref}.zip`);
  }

  protected getTemplateDir(): string {
    return path.resolve(this.dirPath, '.templates');
  }
}
