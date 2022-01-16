import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { queryAssignedElements } from './util/query';
import { VisibleFocusController } from './visible-focus.controller';

const focusableSelectors = [
  'a[href]',
  'button',
  '[tabindex]',
  'input',
  'select',
  'textarea',
];

export class InputController implements ReactiveController {
  protected visibleFocusController?: VisibleFocusController;

  constructor(protected host: LitElement) {
    this.host.addController(this);
    this.visibleFocusController = new VisibleFocusController(this.host);
  }

  hostConnected(): void {
    this.host.addEventListener('click', (ev: Event) => {
      // we do not focus the control in case another (custom) focusable
      // element is used inside the form control (ie inside prefix)
      if (!this.isFocusable(ev.target as HTMLElement)) {
        this.control?.focus();
      }
    });
  }

  render(): TemplateResult {
    return html`
      <slot @slotchange=${(): void => this.handleDisable()}>
        <input />
      </slot>
    `;
  }

  /**
   * Returns the main control (input, select, etc.) that is available.
   * Other controls that might be added to the prefix or suffix will be ignored.
   */
  get control(): HTMLInputElement | null {
    return queryAssignedElements(this.host, {
      selector: 'input',
      flatten: true,
    })?.[0] as HTMLInputElement;
  }

  /**
   * Indicates whether the given element is focusable (ie. button, select, input).
   */
  protected isFocusable(element: HTMLElement): boolean {
    return focusableSelectors
      .map((selector) => selector.split('[')[0])
      .includes(element.tagName.toLowerCase());
  }

  protected controlAttrObserver?: MutationObserver;

  protected handleDisable(): void {
    if (this.control) {
      this.host.toggleAttribute('disabled', this.control.disabled);
      this.controlAttrObserver?.disconnect();
      this.controlAttrObserver = new MutationObserver(() => {
        this.host.toggleAttribute('disabled', this.control?.disabled);
      });
      this.controlAttrObserver.observe(this.control, {
        attributeFilter: ['disabled', 'readonly'],
      });
    }
  }

  hostDisconnected(): void {
    this.controlAttrObserver?.disconnect();
  }
}
