import {
  ElementAttributes,
  ElementDefinition,
  HeadDOMService,
} from './head-dom.service';

export class DefaultHeadDOMService implements HeadDOMService {
  addElements(definitions: ElementDefinition[]): void {
    console.log(definitions);
    for (const definition of definitions) {
      if (definition.name === 'html') {
        this.updateElement(definition);

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

  addElement(definition: ElementDefinition): void {
    if (this.getElement(definition)) {
      return;
    }

    const element = document.createElement(definition.name);
    this.setAttributes(definition.attrs, element);
    document.getElementsByTagName('head')[0].appendChild(element);
  }

  protected getElement(definition: ElementDefinition): HTMLElement | null {
    let attrs = '';
    for (const [attr, value] of Object.entries(definition.attrs)) {
      if (attr === 'text') {
        continue;
      }

      attrs += `[${attr}="${value}"]`;
    }
    console.log(`${definition.name}${attrs}`);
    return document.querySelector(`${definition.name}${attrs}`);
  }

  protected setAttributes(
    attrs: ElementAttributes,
    element: HTMLElement
  ): void {
    for (const [attr, value] of Object.entries(attrs)) {
      if (attr === 'text') {
        element.textContent = value;

        continue;
      }

      element.setAttribute(attr, value);
    }
  }

  protected getTags(selector: string): HTMLElement[] {
    const nodes = document.querySelectorAll<HTMLElement>(selector);
    return [...nodes];
  }
}
