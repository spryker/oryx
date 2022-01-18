import { html, LitElement, TemplateResult } from 'lit';
import { CollapseToggleController } from './navigation-collapse.controller';
import { navigationStyles } from './navigation.styles';

export class NavigationComponent extends LitElement {
  static styles = [navigationStyles];

  protected collapse = new CollapseToggleController(this);

  render(): TemplateResult {
    return html`
      <svg viewBox="0 0 121 50">
        <use href="assets/full-logo.svg#logo" />
        <use href="assets/full-logo.svg#text" class="letter-logo" />
      </svg>
      <slot></slot>
      <button @click=${this.toggle} tabindex="-1">
        <oryx-icon type="back" size="medium"></oryx-icon>
      </button>
    `;
  }

  protected toggle(): void {
    this.collapse.toggle();
  }
}
