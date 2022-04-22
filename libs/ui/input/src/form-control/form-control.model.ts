import { ErrorOptions } from '..';
import { FormControlController } from './form-control.controller';

export interface FormControlOptions extends ErrorOptions {
  /**
   * The label property can be set on the host element and will be rendered
   * inside the `<label>` element.
   *
   * Custom content can be placed alternatively using a slot:
   *
   * ```html
   * <div slot="label">custom label</div>
   * ```
   */
  label?: string;
}

export declare class FormControlInterface {
  formControlController: FormControlController;
}
