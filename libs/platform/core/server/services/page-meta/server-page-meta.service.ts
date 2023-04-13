import {
  DefaultPageMetaService,
  ElementAttributes,
  ElementDefinition,
} from '@spryker-oryx/core';

export class ServerPageMetaService extends DefaultPageMetaService {
  protected template = '';

  add(definitions: ElementDefinition | ElementDefinition[] = []): void {
    if (!Array.isArray(definitions)) {
      definitions = [definitions];
    }

    this.meta.push(...definitions);
    let stream = ``;

    for (const { name, attrs } of this.meta) {
      if (name === 'html') {
        this.setHtmlAttributes(attrs);

        continue;
      }

      if (attrs.text) {
        stream += `\n<${name}>${attrs.text}</${name}>`;

        continue;
      }

      stream += `\n<${name}${this.setAttributes(attrs)} />`;
    }

    this.template = this.template.replace('</head>', `${stream}\n</head>`);
  }

  setHtmlAttributes(attrs: ElementAttributes): void {
    this.template = this.template.replace(
      '<html',
      `<html ${this.setAttributes(attrs)}`
    );
  }

  protected setAttributes(attrs: ElementAttributes): string {
    return Object.entries(attrs).reduce(
      (acc, [key, value]) => `${acc} ${key}="${value}"`,
      ''
    );
  }

  getTemplateHtml(template: string): string {
    this.template = template;
    this.add();
    return this.template;
  }
}
