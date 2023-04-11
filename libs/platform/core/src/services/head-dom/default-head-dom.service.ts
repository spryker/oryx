import { HeadDOMService, TagAttributes, TagDefinition } from './meta.service';

export class DefaultHeadDOMService implements HeadDOMService {
  addTags(tags: TagDefinition[]): void {
    for (const tag of tags) {
      this.addTag(tag);
    }
  }

  updateTag(tag: TagDefinition): void {
    const element = document.querySelector<HTMLElement>(tag.name);

    if (!element) {
      this.addTag(tag);

      return;
    }

    this.setAttributes(tag.attrs, element);
  }

  addTag(tag: TagDefinition): void {
    const element = document.createElement(tag.name);
    this.setAttributes(tag.attrs, element);
    document.getElementsByTagName('head')[0].appendChild(element);
  }

  protected setAttributes(attrs: TagAttributes, element: HTMLElement): void {
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
