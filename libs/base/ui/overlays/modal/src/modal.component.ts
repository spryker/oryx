import { isFirefox, Size } from '@spryker-oryx/ui/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { DialogElement } from '../../overlay.model';
import { fullscreenModalStyles } from './fullscreen-modal.styles';
import { BACK_EVENT, CLOSE_EVENT, ModalProperties } from './modal.model';
import { styles } from './modal.styles';

export class ModalComponent extends LitElement implements ModalProperties {
  static styles = [styles, fullscreenModalStyles];

  protected backdropTargetTag = 'dialog';
  protected initialBodyOverflow?: string;

  @property({ type: Boolean, attribute: 'open' }) isOpen?: boolean;
  @property({ type: Boolean, reflect: true }) fullscreen?: boolean;
  @property() heading?: string;
  @property({ type: Boolean }) preventCloseByEscape?: boolean;
  @property({ type: Boolean }) preventCloseByBackdrop?: boolean;
  @property({ type: Boolean }) enableCloseButtonInHeader?: boolean;
  @property({ type: Boolean }) enableFooter?: boolean;
  @property({ type: Boolean }) enableNavigateBack?: boolean;

  requestUpdate(name?: PropertyKey, oldValue?: unknown): void {
    if (name === 'isOpen' && this.isOpen !== oldValue) {
      this.setDialogState();
    }

    super.requestUpdate(name, oldValue);
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.setDialogState();
  }

  disconnectedCallback(): void {
    if (this.isOpen) {
      this.toggleScrollLock();
    }

    super.disconnectedCallback();
  }

  protected setDialogState(): void {
    if (this.isOpen) {
      this.dialog?.showModal?.();
    } else {
      this.dialog?.close?.();
    }

    this.toggleScrollLock(this.isOpen);
  }

  protected toggleScrollLock(lock = false): void {
    if (lock) {
      this.initialBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'clip';
      return;
    }

    // Need to restore initial value of body overflow property
    // in case if it predefined as style property
    // Also firefox has a bug with overflow: clip. It required default value
    // to make it work correctly. "auto" is using as default
    document.body.style.overflow =
      this.initialBodyOverflow || isFirefox() ? 'auto' : '';
  }

  close(): void {
    this.dispatchEvent(
      new CustomEvent(CLOSE_EVENT, {
        bubbles: true,
        composed: true,
      })
    );
    this.removeAttribute('open');
  }

  open(): void {
    this.toggleAttribute('open');
  }

  protected onBackdropClick(e: MouseEvent): void {
    e.stopPropagation();
    if (this.preventCloseByBackdrop) {
      return;
    }

    const target = e.composedPath()[0] as HTMLElement;
    if (target.tagName.toLowerCase() === this.backdropTargetTag) {
      this.close();
    }
  }

  protected onCancel(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!this.preventCloseByEscape) {
      this.close();
    }
  }

  protected onGoBack(): void {
    this.dispatchEvent(
      new CustomEvent(BACK_EVENT, {
        bubbles: true,
        composed: true,
      })
    );
  }

  protected get dialog(): DialogElement {
    return this.shadowRoot?.querySelector('dialog') as DialogElement;
  }

  protected override render(): TemplateResult {
    return html`
      <dialog
        @click="${(e: MouseEvent): void => this.onBackdropClick(e)}"
        @cancel=${(e: Event): void => this.onCancel(e)}
        @close=${this.close}
      >
        <form method="dialog">${this.renderBody()}</form>
      </dialog>
    `;
  }

  protected renderHeading(): TemplateResult {
    return html`
      <header slot="heading">
        ${when(
          this.enableNavigateBack,
          () => html`
            <oryx-icon-button>
              <button
                type="button"
                aria-label="navigate back"
                @click=${this.onGoBack}
              >
                <oryx-icon type="back"></oryx-icon>
              </button>
            </oryx-icon-button>
          `
        )}
        <slot name="heading">
          <oryx-heading>
            <h5>${this.heading}</h5>
          </oryx-heading>
        </slot>

        ${when(
          this.enableCloseButtonInHeader,
          () => html`
            <oryx-icon-button size=${Size.small}>
              <button value="cancel" aria-label="close modal">
                <oryx-icon type="close"></oryx-icon>
              </button>
            </oryx-icon-button>
          `
        )}
      </header>
    `;
  }

  protected renderBody(): TemplateResult {
    return html`
      <oryx-card>
        ${this.renderHeading()}

        <slot></slot>

        ${when(
          this.enableFooter,
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
