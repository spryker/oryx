import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { getControl } from '../../../form/utilities';
import { toggleIconStyles } from './toggle-icon.styles';

const GENERATED_INPUT_EVENT = 'oryx-gen';

export class ToggleIconComponent extends LitElement {
  static styles = [toggleIconStyles];

  @property({ type: Boolean }) hasError?: boolean;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('input', this.onInput as EventListener);
  }

  disconnectedCallback(): void {
    this.removeEventListener('input', this.onInput as EventListener);
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected onInput(e: InputEvent): void {
    const el = e.target as HTMLInputElement;
    this.toggleAttribute('checked', el.checked);

    if (
      this.isInRadioGroup(el) &&
      e.detail?.toString() !== GENERATED_INPUT_EVENT
    ) {
      this.updateSiblings(el);
    }
  }

  protected isInRadioGroup(el: HTMLInputElement): boolean {
    return el.type === 'radio' && el.hasAttribute('name');
  }

  protected updateSiblings(input: HTMLInputElement): void {
    const siblings = Array.from(
      (this.getRootNode() as HTMLElement).querySelectorAll(
        `[name=${input.getAttribute('name')}]`
      )
    ).filter((sibling) => sibling !== input);

    siblings.forEach((sibling) =>
      sibling.dispatchEvent(
        new CustomEvent('input', {
          bubbles: true,
          composed: true,
          detail: GENERATED_INPUT_EVENT,
        })
      )
    );
  }

  firstUpdated(): void {
    const input = getControl<HTMLInputElement>(this);

    this.toggleAttribute('has-text', !!this.getSpan());
    this.toggleAttribute('disabled', input.hasAttribute('disabled'));
    this.toggleAttribute('checked', input.hasAttribute('checked'));

    const controlAttrObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (typeof mutation.attributeName === 'string') {
          this.toggleAttribute(mutation.attributeName);
        }
      }
    });
    controlAttrObserver.observe(input, {
      attributeFilter: ['disabled'],
    });
  }

  private getSpan(): HTMLSpanElement {
    return this.shadowRoot
      ?.querySelector('slot')
      ?.assignedElements({ flatten: true })
      .find(
        (e: Element) => e.tagName.toLowerCase() === 'span'
      ) as HTMLInputElement;
  }
}
