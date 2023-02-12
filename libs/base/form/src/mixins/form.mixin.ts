import { Type } from '@spryker-oryx/di';
import { asyncState, observe, valueType } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject } from 'rxjs';
import { FormMixinProperties, SUBMIT_EVENT } from '../models';

export declare class FormMixinInterface<FormValues = unknown>
  implements FormMixinProperties<FormValues>
{
  getForm(): HTMLFormElement | null;
  submit(): void;

  values?: FormValues;
  protected formValues?: FormValues;
}

export class FormMixinController implements ReactiveController {
  constructor(protected host: LitElement & FormMixinProperties) {
    this.host.addController(this);
  }

  async hostConnected(): Promise<void> {
    //simulate first updated hook
    this.host.requestUpdate();
    await this.host.updateComplete;

    this.host.getForm()?.addEventListener('submit', (e) => this.onSubmit(e));
  }

  hostDisconnected(): void {
    this.host.getForm()?.removeEventListener('submit', (e) => this.onSubmit(e));
  }

  protected onSubmit(e: Event): void {
    e.preventDefault();

    const values = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );

    this.host.dispatchEvent(
      new CustomEvent(SUBMIT_EVENT, {
        composed: true,
        bubbles: true,
        detail: { values },
      })
    );
  }
}

export const FormMixin = <
  // TODO: remove any and pass generic type to mixin
  // when we fix issue with types inference of mixins chain
  Values = any,
  T extends Type<LitElement> = Type<LitElement>
>(
  superClass: T
): Type<FormMixinInterface<Values>> & T => {
  class FormMixinClass extends superClass {
    protected formMixinController = new FormMixinController(this);

    getForm(): HTMLFormElement | null {
      return this.renderRoot.querySelector('form');
    }

    submit(): void {
      const form = this.getForm();

      if (!form) {
        throw new Error('Form element is not provided');
      }

      // For safari 15- and other old browsers
      if (!form.requestSubmit) {
        if (!form.checkValidity()) {
          form.reportValidity();
        } else {
          form.submit();
        }
        return;
      }

      form.requestSubmit();
    }

    @property({ type: Object }) values?: Values;

    @observe()
    protected values$ = new BehaviorSubject(this.values);

    @asyncState()
    protected formValues = valueType(this.values$);
  }

  return FormMixinClass as unknown as Type<FormMixinInterface<Values>> & T;
};
