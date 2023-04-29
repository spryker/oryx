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

  remove(definitions: ElementDefinition | ElementDefinition[]): void {
    if (!Array.isArray(definitions)) {
      definitions = [definitions];
    }

    for (const definition of definitions) {
      const existedEl = this.get(definition);

      if (existedEl) {
        existedEl?.remove();
      }
    }
  }

  update(definition: ElementDefinition): void {
    const element = document.head.querySelector<HTMLElement>(definition.name);

    if (!element) {
      this.insert(definition);

      return;
    }

    this.setAttributes(definition.attrs, element);
  }

  setHtmlAttributes(attrs: ElementAttributes): void {
    this.setAttributes(attrs, document.documentElement);
  }

  protected getTagName(name: string): string {
    return ['link', 'style', 'title', 'script', 'html', 'meta'].includes(name)
      ? name
      : 'meta';
  }

  protected setAttributes(
    attrs: ElementAttributes,
    element: HTMLElement
  ): void {
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'text' && value) {
        element.textContent = value;

        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element.setAttribute(key, value!);
    }
  }

  protected insert(definition: ElementDefinition): void {
    this.remove(definition);
    const name = this.getTagName(definition.name);
    const element = document.createElement(name);

    if (name === 'meta' && definition.name !== 'meta') {
      definition.attrs.name = definition.name;
    }

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

    const name = this.getTagName(definition.name);
    return document?.head?.querySelector?.(`${name}${attrs}`);
  }
}
