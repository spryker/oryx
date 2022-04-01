import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ChipType } from './chip.model';
import { styles } from './chip.styles';

export class ChipComponent extends LitElement {
  static styles = styles;

  @property({ reflect: true }) type?: ChipType;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
