import { TypeaheadOptions } from '../../typeahead';

export interface SelectOptions extends TypeaheadOptions {
  /**
   * Indicates that the select will have an empty value by default
   * unless there's an option `selected` or the input control comes with a value.
   */
  allowEmptyValue?: boolean;
}
