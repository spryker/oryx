import { hydratable, i18n, rootInjectable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { styles } from './mode-selector.styles';

export const EVENT_TOGGLE_MODE = 'oryx.toggle-mode';

@hydratable(['mouseover', 'focusin'])
export class ModeSelectorComponent extends LitElement {
  static styles = styles;

  protected darkMode = 'mode-dark';
  protected lightMode = 'mode-light';
  protected root = rootInjectable.get();

  @state()
  protected current = this.lightMode;

  constructor() {
    super();
    this.toggleMode = this.toggleMode.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(EVENT_TOGGLE_MODE, this.toggleMode);
  }

  disconnectedCallback(): void {
    window.removeEventListener(EVENT_TOGGLE_MODE, this.toggleMode);
    super.disconnectedCallback();
  }

  protected toggleMode(event: Event): void {
    const root = document.querySelector(this.root);
    root?.removeAttribute(this.current);
    this.current =
      (event as CustomEvent<string>).detail === this.lightMode
        ? this.darkMode
        : this.lightMode;
    root?.setAttribute(this.current, '');
  }

  protected triggerEvent(): void {
    this.dispatchEvent(
      new CustomEvent(EVENT_TOGGLE_MODE, {
        bubbles: true,
        composed: true,
        detail: this.current,
      })
    );
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-icon-button>
        <button
          type="button"
          aria-label="${i18n('site.change-color-mode')}"
          @click=${() => this.triggerEvent()}
        >
          <oryx-icon type="${this.current}"></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
