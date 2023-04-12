import {
  DefaultPageHeadService,
  ElementAttributes,
  ElementDefinition,
} from '@spryker-oryx/core';

export class ServerPageHeadService extends DefaultPageHeadService {
  protected template = '';

  addElements(definitions: ElementDefinition | ElementDefinition[]): void {
    if (!Array.isArray(definitions)) {
      definitions = [definitions];
    }

    let stream = ``;

    for (const { name, attrs } of definitions) {
      if (name === 'html') {
        this.updateHtmlElement(attrs);

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

  setAttributes(attrs: ElementAttributes): string {
    return Object.entries(attrs).reduce(
      (acc, [key, value]) => `${acc} ${key}="${value}"`,
      ''
    );
  }

  updateHtmlElement(attrs: ElementAttributes): void {
    this.template = this.template.replace(
      '<html',
      `<html ${this.setAttributes(attrs)}`
    );
  }

  getTemplateHtml(
    template: string,
    definitions: ElementDefinition | ElementDefinition[] = []
  ): string {
    this.template = template;
    this.addElements(definitions);
    return this.template;
  }
}
