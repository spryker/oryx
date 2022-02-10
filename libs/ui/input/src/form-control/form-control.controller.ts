import { html, ReactiveController, TemplateResult } from 'lit';
import { OryxElement } from '../../../utilities';
import { getControl } from '../../util';
import { ErrorController } from '../error/error.controller';
import { LabelController } from '../label/label.controller';
import { FormControlOptions } from './form-control.model';
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
  protected visibleFocusController: VisibleFocusController;
  protected labelController: LabelController;
  protected errorController: ErrorController;

  constructor(protected host: OryxElement<FormControlOptions>) {
    this.host.addController(this);
    this.visibleFocusController = new VisibleFocusController(this.host);
    this.labelController = new LabelController(this.host);
    this.errorController = new ErrorController(this.host);
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

  render(
    content: {
      before?: TemplateResult;
      after?: TemplateResult;
    } = {}
  ): TemplateResult {
    return html`
      ${this.labelController.render()}
      <div class="control">
        ${content.before}
        <slot @slotchange=${(): void => this.handleDisabled()}>
          <input />
        </slot>
        ${content.after}
      </div>
      ${this.errorController.render()}
    `;
  }

  /**
   * Returns the main control (input, select, etc.) that is available.
   * Other controls that might be added to the prefix or suffix will be ignored.
   */
  get control(): HTMLInputElement | undefined {
    return getControl(this.host);
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
