import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './toggle.styles';

export class ToggleComponent extends LitElement {
  static styles = styles;

  protected override render(): TemplateResult {
    return html`
      <label>
        <slot><input type="checkbox" /></slot>
      </label>
    `;
  }
}
