import { html, TemplateResult } from 'lit';
import { ModalComponent } from '../../../modal';
import { NDSStyles } from './modal.styles';

export class NDSModalComponent extends ModalComponent {
  override backdropTargetTag = this.tagName.toLowerCase();
  static styles = NDSStyles;

  protected override setDialogState(): void {
    if (this.isOpen) {
      window.addEventListener('keydown', this.keyDownHandler);
      this.addEventListener('click', this.backdropClickHandler);
    } else {
      this.onDestroy();
    }
  }

  protected keyDownHandler = (e: KeyboardEvent): void => {
    e.preventDefault();

    if (e.key === 'Escape' && !this.disableCloseOnEscape) {
      this.close();
    }
  };

  protected onDestroy(): void {
    window.removeEventListener('keydown', this.keyDownHandler);
    this.removeEventListener('click', this.backdropClickHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.onDestroy();
  }

  protected override render(): TemplateResult {
    return html`
      <dialog role="dialog" aria-modal="true">
        <oryx-card>
          <slot name="header" slot="header"> ${this.header} </slot>
          <slot></slot>
          <div slot="footer">
            <slot name="footer">
              <oryx-button
                type="secondary"
                outline
                size="small"
                @click=${this.close}
              >
                <button value="cancel">Cancel</button>
              </oryx-button>
            </slot>
          </div>
        </oryx-card>
      </dialog>
    `;
  }
}
