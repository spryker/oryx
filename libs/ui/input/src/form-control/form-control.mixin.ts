import { LitElement } from 'lit';
import { Constructor } from '../../../utilities/model';
import { FormControlController } from './form-control.controller';
import { FormControlInterface } from './form-control.model';

export const FormControlMixin = <T extends Constructor<LitElement>>(
  superClass: T
): Constructor<FormControlInterface> & T => {
  class InputClass extends superClass {
    formControlController = new FormControlController(this);
  }

  return InputClass as unknown as Constructor<FormControlInterface> & T;
};
