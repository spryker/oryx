import { html, LitElement, TemplateResult } from 'lit';
import { popoverStyles } from './popover.styles';

export class PopoverComponent extends LitElement {
  static styles = [popoverStyles];

  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  constructor() {
    super();
    this.addEventListener('mousedown', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    });

    this.addEventListener('mouseup', (e: Event) => {
      if (e.target === this) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }
}
