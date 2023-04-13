import { ElementAttributes, ElementDefinition } from './page-meta.model';
import { PageMetaService } from './page-meta.service';

export class DefaultPageMetaService implements PageMetaService {
  add(definitions: ElementDefinition | ElementDefinition[]): void {
    if (!Array.isArray(definitions)) {
      definitions = [definitions];
    }

    for (const definition of definitions) {
      if (definition.name === 'html') {
        this.setAttributes(definition.attrs);

        continue;
      }

      this.addElement(definition);
    }
  }

  update(definition: ElementDefinition): void {
    const element = document.querySelector<HTMLElement>(definition.name);

    if (!element) {
      this.addElement(definition);

      return;
    }

    this.setAttributes(definition.attrs, element);
  }

  setAttributes(attrs: ElementAttributes, element = document.documentElement): void {
    for (const [key, value] of Object.entries(attrs)) {
      if (value === 'text') {
        element.textContent = value;

        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element.setAttribute(key, value!);
    }
  }

  protected addElement(definition: ElementDefinition): void {
    if (this.getElement(definition)) {
      return;
    }

    const element = document.createElement(definition.name);
    this.setAttributes(definition.attrs, element);
    document.head.appendChild(element);
  }

  protected getElement(definition: ElementDefinition): HTMLElement | null {
    let attrs = '';

    for (const [key, value] of Object.entries(definition.attrs)) {
      if (key === 'text') {
        continue;
      }

      attrs += `[${key}="${value}"]`;
    }

    return document.head.querySelector(`${definition.name}${attrs}`);
  }
}
