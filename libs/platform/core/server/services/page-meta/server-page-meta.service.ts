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
      const preload = this.getPreload(meta);
      if (preload) metas.push(preload);

      const duplicate = this.metas.find(
        (_meta) => JSON.stringify(_meta) === JSON.stringify(meta)
      );

      if (!duplicate) this.metas.push(meta);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(definition: ElementDefinition): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(definitions: ElementDefinition | ElementDefinition[]): void {
    //
  }

  protected setAttributes(attrs: ElementAttributes): string {
    return Object.entries(attrs).reduce(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (acc, [key, value]) => `${acc} ${key}="${this.escapeValue(value!)}"`,
      ''
    );
  }

  protected addTags(): void {
    const stream = { head: '', body: '' };

    for (const { name, attrs, toBody } of this.metas) {
      const type = toBody ? 'body' : 'head';
      const tag = this.getTagName(name);

      if (tag === 'html') {
        this.template = this.template.replace(
          '<html',
          `<html ${this.setAttributes(attrs)}`
        );

        continue;
      }

      if (attrs.text) {
        stream[type] += `\n<${tag}>${attrs.text}</${tag}>`;

        continue;
      }

      if (tag === 'meta' && name !== 'meta') {
        attrs.name = name;
      }

      if (name === 'canonical') {
        attrs.rel = 'canonical';
        attrs.href = attrs.content;
        delete attrs.content;
      }

      stream[type] += `\n<${tag}${this.setAttributes(attrs)} />`;
    }

    const marker = this.template.includes('</head') ? '</head' : '<body';
    this.template = this.template
      .replace(marker, `${stream.head}\n${marker}`)
      .replace('</body>', `${stream.body}\n</body>`);
  }
}
