import { isFocusable } from '@spryker-oryx/typescript-utils';
import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { getControl } from '../../../utilities/getControl';
import { ErrorController } from '../error/error.controller';
import { FormControlOptions } from './form-control.model';
import { VisibleFocusController } from './visible-focus.controller';

export class FormControlController implements ReactiveController {
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
      this.control.focus();
    }
  }

  render(
    content: {
      before?: TemplateResult;
      after?: TemplateResult;
    } = {}
  ): TemplateResult {
    return html`
      <label>
        <slot name="label" part="label">${this.host.label}</slot>
        <div class="control">
          ${content.before}
          <slot
            @slotchange=${(): void => this.handleSlotChange()}
            @input=${(): void => this.toggleHasValueAttribute()}
          >
            <input />
          </slot>
          ${content.after}
        </div>
      </label>
      ${this.errorController.render()}
    `;
  }

  protected controlAttrObserver?: MutationObserver;

  protected handleSlotChange(): void {
    this.detectAutofill();
    this.toggleHasValueAttribute();
    this.adjustDisabledState();
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
        if (this.control.matches(':-webkit-autofill')) {
          this.host.toggleAttribute('has-value', true);
          clearInterval(interval);
        }
      } catch (e) {
        clearInterval(interval);
      }
    }, 30);
  }

  protected toggleHasValueAttribute(): void {
    this.host.toggleAttribute('has-value', !!this.control.value);
  }

  protected adjustDisabledState(): void {
    this.host.toggleAttribute('disabled', this.control.disabled);
    this.registerListener({ attributes: ['disabled', 'readonly'] }, () => {
      this.host.toggleAttribute('disabled', this.control.disabled);
    });
  }

  protected _attributes = ['disabled', 'readonly'];
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
    this.controlAttrObserver.observe(this.control, {
      attributeFilter: this._attributes,
    });
  }

  protected get control():
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement {
    return getControl(this.host);
  }

  constructor(protected host: FormControlOptions & LitElement) {
    this.host.addController(this);
    this.visibleFocusController = new VisibleFocusController(this.host);
    this.errorController = new ErrorController(this.host);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
  }
}
