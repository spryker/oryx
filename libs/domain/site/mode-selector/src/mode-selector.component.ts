import { AppRef, ComponentsPlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { styles } from './mode-selector.styles';

export const EVENT_TOGGLE_MODE = 'oryx.toggle-mode';

@hydratable(['mouseover', 'focusin'])
export class ModeSelectorComponent extends LitElement {
  static styles = styles;

  protected darkMode = 'mode-dark';
  protected lightMode = 'mode-light';
  protected root =
    resolve(AppRef).findPlugin(ComponentsPlugin)?.getRoot() ?? 'body';
  @state()
  protected current = this.lightMode;

  constructor() {
    super();

    this.toggleMode = this.toggleMode.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener(EVENT_TOGGLE_MODE, this.toggleMode);
  }

  disconnectedCallback(): void {
    this.removeEventListener(EVENT_TOGGLE_MODE, this.toggleMode);

    super.disconnectedCallback();
  }

  toggleMode(mode?: any): void {
    const root = document.querySelector(this.root);
    root?.removeAttribute(this.current);
    this.current =
      mode ?? this.current === this.lightMode ? this.darkMode : this.lightMode;
    root?.setAttribute(this.current, '');
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-icon-button size="lg">
        <button
          type="button"
          aria-label="${i18n('site.change-color-mode')}"
          @click=${() => this.toggleMode()}
        >
          <oryx-icon type="${this.current}"></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
