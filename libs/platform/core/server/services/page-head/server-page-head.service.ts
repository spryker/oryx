import {
  DefaultPageHeadService,
  ElementAttributes,
  ElementDefinition,
} from '@spryker-oryx/core';

export class ServerPageHeadService extends DefaultPageHeadService {
  addElements(): void {
    //
  }

  updateElement(): void {
    //
  }

  addElement(): void {
    //
  }

  getElements(definitions: ElementDefinition[]): string {
    let stream = ``;

    for (const { name, attrs } of definitions) {
      if (name === 'html') {
        continue;
      }

      if (name === 'title' && attrs.text) {
        stream += `\n<title>${attrs.text}</title>`;

        continue;
      }

      stream += `\n<${name}${this.getElementAttributes(attrs)} />`;
    }

    return stream;
  }

  getElementAttributes(attrs: ElementAttributes): string {
    return Object.entries(attrs).reduce(
      (acc, [key, value]) => `${acc} ${key}="${value}"`,
      ''
    );
  }
}
