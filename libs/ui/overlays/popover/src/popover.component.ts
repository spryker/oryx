import { html, LitElement, TemplateResult } from 'lit';
import { popoverBaseStyles, popoverStyles } from './styles';

export const TAG_NAME = 'oryx-popover';

export class PopoverComponent extends LitElement {
  static styles = [popoverBaseStyles, popoverStyles];

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
