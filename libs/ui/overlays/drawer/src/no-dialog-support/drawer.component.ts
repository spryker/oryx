import { html, TemplateResult } from 'lit';
import { isFocusable } from '../../../../utilities';
import { Dialog } from '../../../overlay.model';
import { DrawerComponent } from '../drawer.component';
import { drawerNDSStyles } from './drawer.styles';
export class NDSDrawerComponent extends DrawerComponent {
  static styles = [...DrawerComponent.styles, drawerNDSStyles];

  protected show(): void {
    this.setAttribute('open', 'open');
    this.focusControlButton();
  }

  protected close(): void {
    this.removeAttribute('open');
    this.resize(false);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  override get dialog(): Dialog {
    return {
      open: this.open,
      show: (): void => this.show(),
      close: (): void => this.close(),
      showModal(): void {
        return;
      },
    };
  }

  get dialogElement(): HTMLElement {
    return this.shadowRoot?.querySelector('[role="dialog"]') as HTMLElement;
  }

  protected get closeButtonElement(): HTMLButtonElement | null | undefined {
    return this.shadowRoot?.querySelector('button[value="cancel"]');
  }

  protected focusControlButton(): void {
    (
      this.shadowRoot?.querySelector('nav button') as HTMLButtonElement
    )?.focus();
  }

  protected override render(): TemplateResult {
    return html`
      <dialog
        ?open=${this.open}
        @click=${(e: MouseEvent): void => this.handleClick(e)}
        @keydown=${(e: KeyboardEvent): void => this.handleKeydown(e)}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        ${super.renderTemplate()}
      </dialog>
    `;
  }

  protected override handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  protected override handleClick(e: MouseEvent): void {
    if (e.target === this.closeButtonElement) {
      this.close();
    }

    if (!isFocusable(e.target as Element)) {
      this.dialogElement?.focus();
    }
  }
}
