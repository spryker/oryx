import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { isFocusable } from '../../../utilities';
import { Position } from '../../../utilities/model/common';
import { DialogElement } from '../../overlay.model';
import { DrawerProperties, DrawerType } from './drawer.model';
import {
  drawerBaseStyles,
  drawerStyles,
  panelBaseStyles,
  panelStyles,
} from './styles';
export const TAG_NAME = 'oryx-drawer';

export class DrawerComponent extends LitElement implements DrawerProperties {
  static styles = [
    drawerBaseStyles,
    panelBaseStyles,
    drawerStyles,
    panelStyles,
  ];

  @property({ reflect: true }) type?: DrawerType;
  @property({ reflect: true }) position?: Position;

  @property({ type: Boolean, attribute: 'not-closable' }) notClosable = false;
  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: Boolean, attribute: 'not-resizable' }) notResizable = false;
  @property({ type: Boolean, reflect: true }) maximize?: boolean;

  @property() navAriaLabel = 'drawer navigation';
  @property() closeButtonAriaLabel = 'close the drawer';
  @property() minimizeButtonAriaLabel = 'minimize the drawer';
  @property() maximizeButtonAriaLabel = 'maximize the drawer';

  get dialog(): DialogElement {
    return this.shadowRoot?.querySelector('dialog') as DialogElement;
  }

  protected renderTemplate(): TemplateResult {
    return html`
      <nav aria-label=${this.navAriaLabel}>
        ${when(
          !this.notClosable,
          () => html`
            <button value="cancel" aria-label=${this.closeButtonAriaLabel}>
              <oryx-icon type="close"></oryx-icon>
            </button>
          `
        )}
        ${when(
          !this.notResizable,
          () => html`
            <button
              aria-label="${this.maximize
                ? this.minimizeButtonAriaLabel
                : this.maximizeButtonAriaLabel}"
              type="button"
              @click=${(): void => this.resize()}
            >
              <oryx-icon
                type="${this.maximize ? 'minimize' : 'maximize'}"
              ></oryx-icon>
            </button>
          `
        )}
      </nav>
      <slot></slot>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      <dialog
        ?open=${this.open}
        @click=${(e: MouseEvent): void => this.handleClick(e)}
        @keydown=${(e: KeyboardEvent): void => this.handleKeydown(e)}
        @submit=${(): void => this.handleSubmit()}
        tabindex="-1"
      >
        <form method="dialog">${this.renderTemplate()}</form>
      </dialog>
    `;
  }

  protected resize(force?: boolean): void {
    this.maximize = force ?? !this.maximize;
  }

  protected handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.open = false;
      this.dialog?.close();
      this.resize(false);
    }
  }

  protected handleClick(e: MouseEvent): void {
    if (!isFocusable(e.target as Element)) {
      this.dialog?.focus();
    }
  }

  protected handleSubmit(): void {
    this.open = false;
    this.resize(false);
  }
}
