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

export const EVENT_TOGGLE_MODE = 'oryx.toggle-mode';
export const modeStorageKey = 'oryx.modeStorageKey';

export interface ModeEvent {
  old: string;
  mode: string;
}

@hydratable(['window:load'])
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
  protected mode = this.lightMode;

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
    const { old, mode } = (event as CustomEvent<ModeEvent>).detail;
    const root = document.querySelector(this.root);
    root?.removeAttribute(old);
    this.mode = mode;
    root?.setAttribute(mode, '');
    this.storage.set(modeStorageKey, mode);
  }

  protected triggerEvent(): void {
    this.dispatchEvent(
      new CustomEvent(EVENT_TOGGLE_MODE, {
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
          @click=${() => this.triggerEvent()}
        >
          <oryx-icon type="${this.mode}"></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
