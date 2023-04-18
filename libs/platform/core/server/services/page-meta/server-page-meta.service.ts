import {
  DefaultPageMetaService,
  ElementAttributes,
  ElementDefinition,
} from '@spryker-oryx/core';

export class ServerPageMetaService extends DefaultPageMetaService {
  protected template = '';
  protected metas: ElementDefinition[] = [];

  add(definitions: ElementDefinition | ElementDefinition[] = []): void {
    this.metas = Array.isArray(definitions) ? definitions : [definitions];
  }

  setHtmlAttributes(attrs: ElementAttributes): void {
    this.template = this.template.replace(
      '<html',
      `<html ${this.setAttributes(attrs)}`
    );
  }

  getTemplateHtml(template: string): string {
    this.template = template;
    this.addTags();
    return this.template;
  }

  protected setAttributes(attrs: ElementAttributes): string {
    return Object.entries(attrs).reduce(
      (acc, [key, value]) => `${acc} ${key}="${value}"`,
      ''
    );
  }

  protected addTags(): void {
    let stream = ``;

    for (const { name, attrs } of this.metas) {
      const tag = this.getTagName(name);

      if (tag === 'html') {
        this.setHtmlAttributes(attrs);

        continue;
      }

      if (attrs.text) {
        stream += `\n<${tag}>${attrs.text}</${tag}>`;

        continue;
      }

      if (tag === 'meta' && name !== 'meta') {
        attrs.name = name;
      }

      stream += `\n<${tag}${this.setAttributes(attrs)} />`;
    }

    this.template = this.template.replace('</head>', `${stream}\n</head>`);
  }
}
