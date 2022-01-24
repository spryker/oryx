import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { queryFirstAssigned } from '../../../utilities/query.util';
import { VisibleFocusController } from './visible-focus.controller';

const focusableSelectors = [
  'a[href]',
  'button',
  '[tabindex]',
  'input',
  'select',
  'textarea',
];

export class FormControlController implements ReactiveController {
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

  render(before?: TemplateResult, after?: TemplateResult): TemplateResult {
    return html`
      <div class="control">
        ${when(before, () => before)}
        <slot @slotchange=${(): void => this.handleDisabled()}>
          <input />
        </slot>
        ${when(after, () => after)}
      </div>
    `;
  }

  /**
   * Returns the main control (input, select, etc.) that is available.
   * Other controls that might be added to the prefix or suffix will be ignored.
   */
  get control(): HTMLInputElement | undefined {
    return queryFirstAssigned<HTMLInputElement>(this.host, {
      selector: 'input, textarea',
      flatten: true,
    });
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

  protected handleDisabled(): void {
    if (this.control) {
      this.host.toggleAttribute('disabled', this.control.disabled);
      this.registerListener({ attributes: ['disabled', 'readonly'] }, () => {
        this.host.toggleAttribute('disabled', this.control?.disabled);
      });
    }
  }

  protected _attributes = ['disabled', 'readonly'];
  protected _listeners: MutationCallback[] = [];

  registerListener(
    mutation: { attributes: string[] },
    callback: MutationCallback
  ): void {
    this._attributes = [...this._attributes, ...mutation.attributes];
    this._listeners.push(callback);

    if (this.control) {
      this.controlAttrObserver?.disconnect();
      this.controlAttrObserver = new MutationObserver((mutations, observer) => {
        this._listeners.forEach((listener) => listener(mutations, observer));
      });
      this.controlAttrObserver.observe(this.control, {
        attributeFilter: this._attributes,
      });
    }
  }

  hostDisconnected(): void {
    this.controlAttrObserver?.disconnect();
  }
}
