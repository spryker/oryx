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

      if (!this.get(definition)) {
        this.insert(definition);
      }

      const preload = this.getPreload(definition);

      if (preload) {
        definitions.push(preload);
      }
    }
  }

  remove(definitions: ElementDefinition | ElementDefinition[]): void {
    if (!Array.isArray(definitions)) {
      definitions = [definitions];
    }

    for (const definition of definitions) {
      const existed = this.get(definition);

      if (existed) {
        existed?.remove();
      }

      const preload = this.getPreload(definition);

      if (preload) {
        definitions.push(preload);
      }
    }
  }

  update(definition: ElementDefinition): void {
    const element = this.getContainer(definition).querySelector<HTMLElement>(
      definition.name
    );

    if (!element) {
      this.remove(definition);
      this.insert(definition);

      return;
    }

    this.setAttributes(definition.attrs, element);
  }

  setHtmlAttributes(attrs: ElementAttributes): void {
    this.setAttributes(attrs, document.documentElement);
  }

  protected getPreload(
    definition: ElementDefinition
  ): ElementDefinition | void {
    if (definition.disablePreload) {
      return;
    }

    if (definition.name === 'link' && definition.attrs.rel === 'stylesheet') {
      return {
        name: 'link',
        attrs: {
          rel: 'preload',
          href: definition.attrs.href,
        },
      };
    }
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
      element.setAttribute(key, this.escapeValue(value!));
    }
  }

  protected insert(definition: ElementDefinition): void {
    const name = this.getTagName(definition.name);
    const element = document.createElement(name);

    if (name === 'meta' && definition.name !== 'meta') {
      definition.attrs.name = definition.name;
    }

    this.setAttributes(definition.attrs, element);
    this.getContainer(definition).appendChild(element);
  }

  protected get(definition: ElementDefinition): HTMLElement | null {
    let attrs = '';

    for (const [key, value] of Object.entries(definition.attrs)) {
      if (key === 'text') {
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      attrs += `[${key}="${this.escapeValue(value!)}"]`;
    }

    const name = this.getTagName(definition.name);
    return this.getContainer(definition).querySelector(`${name}${attrs}`);
  }

  protected escapeValue(value: string): string {
    return value
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/'/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/—/g, '&mdash;')
      .replace(/–/g, '&ndash;');
  }

  protected getContainer(definition: ElementDefinition): HTMLElement {
    return definition.toBody ? document.body : document.body;
  }
}
