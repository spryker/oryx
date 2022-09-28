import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ChipAppearance, ChipAttributes } from './chip.model';
import { styles } from './chip.styles';

export class ChipComponent extends LitElement implements ChipAttributes {
  static styles = styles;

  @property({ reflect: true }) appearance?: ChipAppearance;
  @property({ reflect: true }) dense?: boolean;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
