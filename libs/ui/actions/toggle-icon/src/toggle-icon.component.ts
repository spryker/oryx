import { html, LitElement, TemplateResult } from 'lit';
import { toggleIconStyles } from './toggle-icon.styles';

export class ToggleIconComponent extends LitElement {
  static styles = [toggleIconStyles];

  private getInput(): HTMLInputElement {
    return this.shadowRoot
      ?.querySelector('slot')
      ?.assignedElements({ flatten: true })
      .find(
        (e: Element) => e.tagName.toLowerCase() === 'input'
      ) as HTMLInputElement;
  }

  private initAttribute(input: HTMLInputElement, name: string): void {
    this.toggleAttribute(name, input.hasAttribute(name));
  }

  firstUpdated(): void {
    const input = this.getInput();

    if (input) {
      this.initAttribute(input, 'checked');
      this.initAttribute(input, 'disabled');

      const controlAttrObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (typeof mutation.attributeName === 'string') {
            this.toggleAttribute(mutation.attributeName);
          }
        }
      });

      controlAttrObserver.observe(input, {
        attributeFilter: ['checked', 'disabled'],
      });
    }
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
