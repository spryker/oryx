import { Position } from '@spryker-oryx/ui';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { DrawerProperties, DrawerType } from './drawer.model';
import {
  drawerBaseStyles,
  drawerStyles,
  panelBaseStyles,
  panelStyles,
} from './styles';

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

  get dialog(): HTMLDialogElement | null | undefined {
    return this.shadowRoot?.querySelector('dialog');
  }

  protected renderTemplate(): TemplateResult {
    return html`
      <nav aria-label=${this.navAriaLabel}>
        ${when(
          !this.notClosable,
          () => html`
            <button value="cancel" aria-label=${this.closeButtonAriaLabel}>
              <oryx-icon .type=${IconTypes.Close}></oryx-icon>
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
      <dialog ?open=${this.open} @submit=${this.handleSubmit} tabindex="-1">
        <form method="dialog">${this.renderTemplate()}</form>
      </dialog>
    `;
  }

  protected resize(force?: boolean): void {
    this.maximize = force ?? !this.maximize;
  }

  protected handleSubmit(e: Event): void {
    e.preventDefault();
    const prevented = !this.dispatchEvent(
      new CustomEvent('beforeclose', {
        cancelable: true,
        bubbles: true,
        composed: true,
      })
    );

    if (!prevented) {
      this.dialog?.close();
      this.open = false;
      this.resize(false);
    }
  }
}
