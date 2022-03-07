import { isFocusable, OryxElement } from '../../../utilities';
import { ErrorController } from '../error/error.controller';
import { LabelController } from '../label/label.controller';
import { getControl } from '../util';
import { FormControlOptions } from './form-control.model';
import { VisibleFocusController } from './visible-focus.controller';
import { html, ReactiveController, TemplateResult } from 'lit';

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
    this.host.addEventListener('mousedown', (e: Event) => {
      // we do not focus the control in case another (custom) focusable
      // element is used inside the form control (ie inside prefix)
      if (!isFocusable(e.target as HTMLElement)) {
        if (e.target === this.host) {
          e.preventDefault();
        }
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
      <label>
        ${this.labelController.render()}
        <div class="control">
          ${content.before}
          <slot @slotchange=${(): void => this.handleDisabled()}>
            <input />
          </slot>
          ${content.after}
        </div>
      </label>
      ${this.errorController.render()}
    `;
  }

  /**
   * Returns the main control (input, select, etc.) that is available.
   * Other controls that might be added to the prefix or suffix will be ignored.
   */
  get control(): HTMLInputElement | HTMLSelectElement | undefined {
    return getControl(this.host);
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

  protected registerListener(
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
