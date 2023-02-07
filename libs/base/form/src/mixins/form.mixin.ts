import { Type } from '@spryker-oryx/di';
import { LitElement } from 'lit';

export declare class FormMixinInterface {
  getForm(): HTMLFormElement | null;
}

export const FormMixin = <T extends Type<LitElement> = Type<LitElement>>(
  superClass: T
): Type<FormMixinInterface> & T => {
  class FormMixinClass extends superClass {
    getForm(): HTMLFormElement | null {
      return this.renderRoot.querySelector('form');
    }
  }

  return FormMixinClass as unknown as Type<FormMixinInterface> & T;
};
