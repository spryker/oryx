import { ElementAttributes, ElementDefinition } from './page-head.model';
import { PageHeadService } from './page-head.service';

export class DefaultPageHeadService implements PageHeadService {
  addElements(definitions: ElementDefinition | ElementDefinition[]): void {
    if (!Array.isArray(definitions)) {
      definitions = [definitions];
    }

    for (const definition of definitions) {
      if (definition.name === 'html') {
        this.updateHtmlElement(definition.attrs);

        continue;
      }

      this.addElement(definition);
    }
  }

  updateElement(definition: ElementDefinition): void {
    const element = document.querySelector<HTMLElement>(definition.name);

    if (!element) {
      this.addElement(definition);

      return;
    }

    this.setAttributes(definition.attrs, element);
  }

  updateHtmlElement(attrs: ElementAttributes): void {
    this.setAttributes(attrs, document.documentElement);
  }

  setAttributes(attrs: ElementAttributes, element: HTMLElement): void {
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
