import { Type } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { LitElement } from 'lit';

export interface FormComponentInterface extends LitElement {
  getForm(): HTMLFormElement | null;
}

export const FormComponentMixin = <T>(): Type<
  FormComponentInterface & ContentComponentProperties<T>
> => {
  class FormComponent extends ComponentMixin<T>() {
    getForm(): HTMLFormElement | null {
      return this.renderRoot.querySelector('form');
    }
  }

  return FormComponent as Type<
    LitElement & FormComponentInterface & ContentComponentProperties<T>
  >;
};
