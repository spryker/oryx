import { ErrorOptions, LabelOptions } from '..';
import { FormControlController } from './form-control.controller';

export interface FormControlOptions extends LabelOptions, ErrorOptions {}

export declare class FormControlInterface {
  formControlController: FormControlController;
}
