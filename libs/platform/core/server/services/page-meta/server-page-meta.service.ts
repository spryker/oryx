import {
  DefaultPageMetaService,
  ElementAttributes,
  ElementDefinition,
} from '@spryker-oryx/core';

export class ServerPageMetaService extends DefaultPageMetaService {
  protected template = '';
  protected metas: ElementDefinition[] = [];

  add(definitions: ElementDefinition | ElementDefinition[] = []): void {
    const metas = Array.isArray(definitions) ? definitions : [definitions];

    for (const meta of metas) {
      const duplicate = this.metas.find(
        (_meta) => JSON.stringify(_meta) === JSON.stringify(meta)
      );

      if (!duplicate) {
        this.metas.push(meta);
      }
    }
  }

  setHtmlAttributes(attrs: ElementAttributes): void {
    const htmlIndex = this.metas.findIndex((meta) => meta.name === 'html');

    if (htmlIndex === -1) {
      this.metas.push({ name: 'html', attrs });

      return;
    }

    const html = this.metas[htmlIndex];

    html.attrs = {
      ...html.attrs,
      ...attrs,
    };
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
        this.template = this.template.replace(
          '<html',
          `<html ${this.setAttributes(attrs)}`
        );

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
