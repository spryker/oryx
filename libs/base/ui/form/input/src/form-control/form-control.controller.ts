import { isFocusable } from '@spryker-oryx/utilities';
import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { getControl } from '../../../utilities/getControl';
import { ErrorController } from '../error/error.controller';
import { FormControlOptions } from './form-control.model';
import { VisibleFocusController } from './visible-focus.controller';

export class FormControlController implements ReactiveController {
  protected control?:
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;
  protected visibleFocusController: VisibleFocusController;
  protected errorController: ErrorController;

  hostConnected(): void {
    this.host.addEventListener('mousedown', this.mouseDownHandler);
  }

  hostUpdated(): void {
    const prefix = this.host.renderRoot.querySelector(
      'slot[name="prefix"]'
    ) as HTMLSlotElement;
    this.host.style.setProperty(
      '--float-label-start-gap',
      `${prefix?.offsetWidth}px`
    );
  }

  hostDisconnected(): void {
    this.removeValidationListeners();
    this.host.removeEventListener('mousedown', this.mouseDownHandler);
    this.controlAttrObserver?.disconnect();
  }

  protected mouseDownHandler(e: MouseEvent): void {
    // we do not focus the control in case another (custom) focusable
    // element is used inside the form control (ie inside prefix)
    if (!isFocusable(e.target as HTMLElement)) {
      if (e.target === this.host) {
        e.preventDefault();
      }
      this.control?.focus();
    }
  }

  render(
    content: {
      before?: TemplateResult;
      after?: TemplateResult;
    } = {}
  ): TemplateResult {
    return html`
      <label aria-label="label ${this.host.label}">
        <slot name="label" part="label">${this.host.label}</slot>
        <div class="control">
          ${content.before}
          <slot
            @slotchange=${(): void => this.handleSlotChange()}
            @input=${(): void => this.toggleHasValueAttribute()}
          >
          </slot>
          ${content.after}
        </div>
      </label>
      ${this.errorController.render()}
    `;
  }

  protected controlAttrObserver?: MutationObserver;

  protected handleSlotChange(): void {
    this.control = getControl(this.host);
    this.detectAutofill();
    this.toggleHasValueAttribute();
    this.addValidationListeners();
    this.adjustAttributes();
    this.registerListener({ attributes: this._attributes }, () =>
      this.adjustAttributes()
    );
  }

  protected setHasErrorAttr(): void {
    this.host.toggleAttribute('hasError', true);
  }

  protected removeHasErrorAttr(): void {
    this.host.toggleAttribute('hasError', false);
  }

  protected addValidationListeners(): void {
    this.control?.addEventListener('invalid', this.setHasErrorAttr);
    this.control?.addEventListener(
      this.control instanceof HTMLSelectElement ? 'change' : 'input',
      this.removeHasErrorAttr
    );
  }

  protected removeValidationListeners(): void {
    this.control?.removeEventListener('invalid', this.setHasErrorAttr);
    this.control?.removeEventListener(
      this.control instanceof HTMLSelectElement ? 'change' : 'input',
      this.removeHasErrorAttr
    );
  }

  protected detectAutofill(): void {
    let timesToTry = 30;

    const interval = setInterval(() => {
      if (timesToTry === 0) {
        clearInterval(interval);
      }
      timesToTry--;

      // try catch is needed here to avoid JSDOM tests error
      try {
        if (this.control?.matches(':-webkit-autofill')) {
          this.host.toggleAttribute('has-value', true);
          clearInterval(interval);
        }
      } catch (e) {
        clearInterval(interval);
      }
    }, 30);
  }

  protected toggleHasValueAttribute(): void {
    this.host.toggleAttribute('has-value', !!this.control?.value);
  }

  protected adjustAttributes(): void {
    this.host.toggleAttribute('disabled', !!this.control?.disabled);
    this.host.toggleAttribute('required', !!this.control?.required);
  }

  protected _attributes = ['required', 'disabled', 'readonly'];
  protected _listeners: MutationCallback[] = [];

  protected registerListener(
    mutation: { attributes: string[] },
    callback: MutationCallback
  ): void {
    this._attributes = [...this._attributes, ...mutation.attributes];
    this._listeners.push(callback);
    this.controlAttrObserver?.disconnect();
    this.controlAttrObserver = new MutationObserver((mutations, observer) => {
      this._listeners.forEach((listener) => listener(mutations, observer));
    });
    this.controlAttrObserver.observe(this.control!, {
      attributeFilter: this._attributes,
    });
  }

  constructor(protected host: FormControlOptions & LitElement) {
    this.host.addController(this);
    this.visibleFocusController = new VisibleFocusController(this.host);
    this.errorController = new ErrorController(this.host);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.setHasErrorAttr = this.setHasErrorAttr.bind(this);
    this.removeHasErrorAttr = this.removeHasErrorAttr.bind(this);
  }
}
