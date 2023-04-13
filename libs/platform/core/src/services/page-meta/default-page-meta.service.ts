import { ElementAttributes, ElementDefinition } from './page-meta.model';
import { PageMetaService } from './page-meta.service';

export class DefaultPageMetaService implements PageMetaService {
  add(definitions: ElementDefinition | ElementDefinition[]): void {
    if (!Array.isArray(definitions)) {
      definitions = [definitions];
    }

    for (const definition of definitions) {
      if (definition.name === 'html') {
        this.setHtmlAttributes(definition.attrs);

        continue;
      }

      this.insert(definition);
    }
  }

  update(definition: ElementDefinition): void {
    const element = document.querySelector<HTMLElement>(definition.name);

    if (!element) {
      this.insert(definition);

      return;
    }

    this.setAttributes(definition.attrs, element);
  }

  setHtmlAttributes(attrs: ElementAttributes): void {
    this.setAttributes(attrs, document.documentElement);
  }

  protected setAttributes(
    attrs: ElementAttributes,
    element: HTMLElement
  ): void {
    for (const [key, value] of Object.entries(attrs)) {
      if (value === 'text') {
        element.textContent = value;

        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element.setAttribute(key, value!);
    }
  }

  protected insert(definition: ElementDefinition): void {
    if (this.get(definition)) {
      return;
    }

    const element = document.createElement(definition.name);
    this.setAttributes(definition.attrs, element);
    document.head.appendChild(element);
  }

  protected get(definition: ElementDefinition): HTMLElement | null {
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
