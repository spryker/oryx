import { html, LitElement, TemplateResult } from 'lit';
import { queryAssignedElements } from 'lit/decorators.js';
import { popoverStyles } from './popover.styles';

export class PopoverComponent extends LitElement {
  static styles = [popoverStyles];

  @queryAssignedElements({ flatten: true }) public items!: Array<HTMLElement>;

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
