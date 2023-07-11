import { IconTypes } from '@spryker-oryx/ui/icon';
import { ColorMode, I18nMixin, rootInjectable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { styles } from './color-mode-selector.styles';
import { ModeEvent, toggleMode } from './utilities';

export const EVENT_TOGGLE_COLOR = 'oryx.toggle-mode';

export class ColorModeSelectorComponent extends I18nMixin(LitElement) {
  static styles = [styles];

  @state()
  protected mode = this.getMode();

  constructor() {
    super();
    this.toggleMode = this.toggleMode.bind(this);
    this.setMode = this.setMode.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(EVENT_TOGGLE_COLOR, this.toggleMode);
    this.darkModeMatcher().addEventListener('change', this.setMode);
  }

  disconnectedCallback(): void {
    window.removeEventListener(EVENT_TOGGLE_COLOR, this.toggleMode);
    this.darkModeMatcher().addEventListener('change', this.setMode);
    super.disconnectedCallback();
  }

  protected toggleMode(event: Event): void {
    toggleMode((event as CustomEvent<ModeEvent>).detail);
    this.setMode();
  }

  protected darkModeMatcher(): MediaQueryList {
    return window.matchMedia?.('(prefers-color-scheme: dark)');
  }

  protected getMode(): string {
    const root = document.querySelector(rootInjectable.get());

    if (root?.hasAttribute(ColorMode.Dark)) return ColorMode.Dark;
    if (root?.hasAttribute(ColorMode.Light)) return ColorMode.Light;

    return this.darkModeMatcher().matches ? ColorMode.Dark : ColorMode.Light;
  }

  protected setMode(): void {
    this.mode = this.getMode();
  }

  protected triggerEvent(): void {
    this.dispatchEvent(
      new CustomEvent(EVENT_TOGGLE_COLOR, {
        bubbles: true,
        composed: true,
        detail: {
          old: this.mode,
          mode:
            this.mode === ColorMode.Light ? ColorMode.Dark : ColorMode.Light,
        },
      })
    );
  }

  protected override render(): TemplateResult {
    const iconType =
      this.mode === ColorMode.Light ? IconTypes.ModeDark : IconTypes.ModeLight;

    return html`
      <oryx-icon-button>
        <button
          type="button"
          aria-label="${this.i18n('site.change-color-mode')}"
          @click=${this.triggerEvent}
        >
          <oryx-icon .type=${iconType}></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
