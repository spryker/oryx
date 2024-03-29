import { html, LitElement, TemplateResult } from 'lit';
import { popoverBaseStyles, popoverStyles } from './styles';

export class PopoverComponent extends LitElement {
  static styles = [popoverBaseStyles, popoverStyles];

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
