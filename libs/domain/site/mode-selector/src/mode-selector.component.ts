import { AppRef, ComponentsPlugin, StorageService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  hydratable,
  i18n,
  isDefined,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { filter, tap } from 'rxjs';
import { styles } from './mode-selector.styles';

export const modeStorageKey = 'oryx.modeStorageKey';

@hydratable('window:load')
export class SiteModeSelectorComponent extends LitElement {
  static styles = styles;

  protected darkMode = 'mode-dark';
  protected lightMode = 'mode-light';
  protected root =
    resolve(AppRef).findPlugin(ComponentsPlugin)?.getRoot() ?? 'body';
  protected storage = resolve(StorageService);

  @subscribe()
  protected mode$ = this.storage.get<string>(modeStorageKey).pipe(
    filter(isDefined),
    tap((mode) =>
      this.toggleMode({
        detail: { old: this.mode, mode },
      } as unknown as Event)
    )
  );

  @state()
  protected mode = this.getBrowserMode();

  constructor() {
    super();
    this.toggleMode = this.toggleMode.bind(this);
    this.setBrowserMode = this.setBrowserMode.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('oryx.toggle-mode', this.toggleMode);
    this.modeMatcher().addEventListener('change', this.setBrowserMode);
  }

  disconnectedCallback(): void {
    window.removeEventListener('oryx.toggle-mode', this.toggleMode);
    this.modeMatcher().addEventListener('change', this.setBrowserMode);
    super.disconnectedCallback();
  }

  protected toggleMode(event: Event): void {
    const { old, mode } = (event as CustomEvent<{ old: string; mode: string }>)
      .detail;
    const root = document.querySelector(this.root);
    root?.removeAttribute(old);
    this.mode = mode;
    root?.setAttribute(mode, '');
    this.storage.set(modeStorageKey, mode);
  }

  protected modeMatcher(): MediaQueryList {
    return window.matchMedia?.('(prefers-color-scheme: dark)');
  }

  protected getBrowserMode(): string {
    return this.modeMatcher().matches ? this.darkMode : this.lightMode;
  }

  protected setBrowserMode(): void {
    const root = document.querySelector(this.root);

    if (
      root?.hasAttribute(this.lightMode) ||
      root?.hasAttribute(this.darkMode)
    ) {
      return;
    }

    this.mode = this.getBrowserMode();
  }

  protected triggerEvent(): void {
    this.dispatchEvent(
      new CustomEvent('oryx.toggle-mode', {
        bubbles: true,
        composed: true,
        detail: {
          old: this.mode,
          mode: this.mode === this.lightMode ? this.darkMode : this.lightMode,
        },
      })
    );
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-icon-button>
        <button
          type="button"
          aria-label="${i18n('site.change-color-mode')}"
          @click=${this.triggerEvent}
        >
          <oryx-icon type="${this.mode}"></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
