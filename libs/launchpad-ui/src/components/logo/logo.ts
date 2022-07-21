import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './logo.styles';

export const iconAsset = 'assets/full-logo.svg';

export class Logo extends LitElement {
  static styles = [styles];

  render(): TemplateResult {
    return html`<svg viewBox="0 0 121 50" data-testid="logo">
      <use href="${iconAsset}#logo" data-testid="logo-icon" />
      <use href="${iconAsset}#text" data-testid="logo-text" />
    </svg>`;
  }
}
