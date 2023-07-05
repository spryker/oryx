import { inject } from '@spryker-oryx/di';
import { promises as fs } from 'fs';
import { createRequire } from 'node:module';
import path from 'path';
import { NodeUtilService } from './node-util.service';

export class TemplateLoaderService {
  protected readonly repoUrl =
    'https://github.com/spryker/composable-frontend/archive/{ref}.zip';

  protected readonly repoRefs = {
    [TemplateRef.Latest]: 'master',
  };

  constructor(
    protected nodeUtilService = inject(NodeUtilService),
    protected pkgPath = import.meta.resolve?.('@spryker-oryx/cli') ??
      Promise.resolve(
        createRequire(import.meta.url).resolve('@spryker-oryx/cli')
      )
  ) {}

  async copyTemplate(path: string, ref = TemplateRef.Latest): Promise<void> {
    await this.dowloadTemplate(ref);

    const templatePath = await this.getTemplatePath(ref);

    try {
      await this.nodeUtilService.copyFolder(templatePath, path);
    } catch (e) {
      throw new Error(`Failed to copy template: ${e}`);
    }
  }

  async dowloadTemplate(ref = TemplateRef.Latest): Promise<void> {
    const templatePath = await this.getTemplatePath(ref);

    if (await fs.stat(templatePath)) {
      return;
    }

    const archivePath = await this.getArchivePath(ref);

    if (!(await fs.stat(archivePath))) {
      try {
        await this.nodeUtilService.downloadFile(
          this.getTemplateUrl(ref),
          archivePath
        );
      } catch (e) {
        throw new Error(`Failed to download template: ${e}`);
      }
    }

    try {
      await this.nodeUtilService.extractZip(archivePath, templatePath);
    } catch (e) {
      throw new Error(`Failed to extract template: ${e}`);
    }
  }

  protected getTemplateUrl(ref: TemplateRef): string {
    return this.repoUrl.replace('{ref}', this.repoRefs[ref]);
  }

  protected async getTemplatePath(ref = TemplateRef.Latest): Promise<string> {
    return path.resolve(await this.getTemplateDir(), ref);
  }

  protected async getArchivePath(ref = TemplateRef.Latest): Promise<string> {
    return path.resolve(await this.getTemplateDir(), `template-${ref}.zip`);
  }

  protected async getTemplateDir(): Promise<string> {
    return path.resolve(await this.pkgPath, '.templates');
  }
}

export enum TemplateRef {
  Latest = 'latest',
}
