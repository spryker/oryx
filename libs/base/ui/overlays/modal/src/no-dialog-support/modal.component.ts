import { html, TemplateResult } from 'lit';
import { ModalComponent } from '../modal.component';
import { NDSStyles } from './modal.styles';

export class NDSModalComponent extends ModalComponent {
  override backdropTargetTag = this.tagName.toLowerCase();
  static styles = [...ModalComponent.styles, NDSStyles];

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

    if (e.key === 'Escape' && !this.preventCloseWithEscape) {
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
      <dialog role="dialog" aria-modal="true">${this.renderBody()}</dialog>
    `;
  }
}
