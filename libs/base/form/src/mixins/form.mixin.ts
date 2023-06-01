import { Type } from '@spryker-oryx/di';
import {
  asyncState,
  observe,
  signalProperty,
  valueType,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { BehaviorSubject } from 'rxjs';
import { FormController } from '../controllers';
import { FormMixinProperties } from '../models';

export declare class FormMixinInterface<FormValues = unknown>
  implements FormMixinProperties<FormValues>
{
  getForm(): HTMLFormElement | null;
  submit(): void;

  values?: FormValues;
  /**
   * @deprecated
   */
  protected formValues?: FormValues;
}

export const FormMixin = <
  // TODO: remove any and pass generic type to mixin
  // when we fix issue with types inference of mixins chain
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Values = any,
  T extends Type<LitElement> = Type<LitElement>
>(
  superClass: T
): Type<FormMixinInterface<Values>> & T => {
  class FormMixinClass extends superClass {
    protected formMixinController = new FormController(this);

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

    @signalProperty({ type: Object }) values?: Values;

    @observe()
    protected values$ = new BehaviorSubject(this.values);

    @asyncState()
    protected formValues = valueType(this.values$);
  }

  return FormMixinClass as unknown as Type<FormMixinInterface<Values>> & T;
};
