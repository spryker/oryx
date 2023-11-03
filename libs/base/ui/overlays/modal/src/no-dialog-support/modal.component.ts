import { html, TemplateResult } from 'lit';
import { ModalComponent } from '../modal.component';
import { NDSStyles } from './modal.styles';

export class NDSModalComponent extends ModalComponent {
  protected override backdropTargetTag = this.tagName.toLowerCase();
  static styles = [...ModalComponent.styles, NDSStyles];

  protected override setDialogState(): void {
    if (this.isOpen) {
      window.addEventListener('keydown', this.onKeydown);
      this.addEventListener('click', this.onBackdropClick);
    } else this.onDestroy();
  }

  protected onKeydown = (e: KeyboardEvent): void => {
    e.preventDefault();

    if (e.key === 'Escape' && !this.preventCloseByEscape) this.close();
  };

  protected onDestroy(): void {
    window.removeEventListener('keydown', this.onKeydown);
    this.removeEventListener('click', this.onBackdropClick);
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
