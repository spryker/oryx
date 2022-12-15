import { Size } from '@spryker-oryx/ui/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { DialogElement } from '../../overlay.model';
import { fullscreenModalStyles } from './fullscreen-modal.styles';
import { CLOSE_EVENT, ModalProperties } from './modal.model';
import { styles } from './modal.styles';

export class ModalComponent extends LitElement implements ModalProperties {
  backdropTargetTag = 'dialog';
  static styles = [styles, fullscreenModalStyles];

  @property({ type: Boolean, attribute: 'open' }) isOpen?: boolean;
  @property({ type: Boolean, reflect: true }) fullscreen?: boolean;
  @property() header?: string;
  @property({ type: Boolean }) preventCloseWithEscape?: boolean;
  @property({ type: Boolean }) preventCloseWithBackdrop?: boolean;
  @property({ type: Boolean }) withoutCloseButton?: boolean;
  @property({ type: Boolean }) withoutFooter?: boolean;

  requestUpdate(name: PropertyKey, oldValue?: unknown): void {
    if (name === 'isOpen' && this.isOpen !== oldValue) {
      this.setDialogState();
    }

    super.requestUpdate(name, oldValue);
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.setDialogState();
  }

  protected setDialogState(): void {
    if (this.isOpen) {
      this.dialog?.showModal?.();
    } else {
      this.dialog?.close?.();
    }
  }

  protected emitCloseEvent(): void {
    this.dispatchEvent(
      new CustomEvent(CLOSE_EVENT, {
        bubbles: true,
        composed: true,
      })
    );
  }

  close(): void {
    this.emitCloseEvent();
    this.removeAttribute('open');
  }

  open(): void {
    this.toggleAttribute('open');
  }

  protected backdropClickHandler(e: MouseEvent): void {
    e.stopPropagation();
    if (this.preventCloseWithBackdrop) {
      return;
    }

    const target = e.composedPath()[0] as HTMLElement;
    if (target.tagName.toLowerCase() === this.backdropTargetTag) {
      this.close();
    }
  }

  protected cancelEventHandler(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!this.preventCloseWithEscape) {
      this.close();
    }
  }

  protected get dialog(): DialogElement {
    return this.shadowRoot?.querySelector('dialog') as DialogElement;
  }

  protected override render(): TemplateResult {
    return html`
      <dialog
        @click="${(e: MouseEvent): void => this.backdropClickHandler(e)}"
        @cancel=${(e: Event): void => this.cancelEventHandler(e)}
        @close=${this.close}
      >
        <form method="dialog">${this.renderBody()}</form>
      </dialog>
    `;
  }

  protected renderBody(): TemplateResult {
    return html`
      <oryx-card>
        <header slot="header">
          <slot name="header">
            <oryx-heading>
              <h5>${this.header}</h5>
            </oryx-heading>
          </slot>

          ${when(
            !this.withoutCloseButton,
            () => html`
              <oryx-icon-button size=${Size.small}>
                <button value="cancel" aria-label="close modal">
                  <slot name="close-icon">
                    <oryx-icon type="close"></oryx-icon>
                  </slot>
                </button>
              </oryx-icon-button>
            `
          )}
        </header>

        <slot></slot>

        ${when(
          !this.withoutFooter,
          () => html`
            <footer slot="footer">
              <slot name="footer">
                <oryx-button type="secondary" outline size="small">
                  <button value="cancel">Cancel</button>
                </oryx-button>
              </slot>
            </footer>
          `
        )}
      </oryx-card>
    `;
  }
}
