import { FacetValue, ValueFacet } from '@spryker-oryx/product';
import { RequireAtLeastOneProp } from '@spryker-oryx/utilities';

export const FACET_SELECT_EVENT = 'oryx.select';

export type SelectRangeFacetValues = RequireAtLeastOneProp<
  { min?: number; max?: number },
  'min' | 'max'
>;
export type SelectRangeFacetValue = { selected: SelectRangeFacetValues };

export type SelectFacetValue = Pick<FacetValue, 'value' | 'selected'>;

export type SelectFacetEventDetailValue =
  | SelectFacetValue
  | SelectRangeFacetValue;

export interface SelectFacetEventDetail {
  name: string;
  value?: SelectFacetEventDetailValue;
}

export interface SingleMultiFacet extends ValueFacet {
  filteredValueLength?: number;
}

export interface SearchFacetComponentAttributes {
  /**
   * Name of the facet which should be rendered.
   */
  name?: string;
  /**
   * Indicates that facet options are multi selectable.
   *
   * @default false
   */
  multi?: boolean;
  /**
   * Indicates the number values that are visible for a facet. This limit is introduced to avoid
   * a lengthy list with values.
   *
   * @default 5;
   */
  renderLimit?: number;
  /**
   * Indicates the number of values when search bar will be visible for the user.
   *
   * @default 13
   */
  minForSearch?: number;
  /**
   * Indicates that collapsible is open or close by default.
   *
   * @default false
   */
  open?: boolean;

  /**
   * Show or hide clear action.
   *
   * @default false
   */
  disableClear?: boolean;

  /**
   * Show or hide clear action.
   *
   * @default true
   *
   * @deprecated Since version 1.2. Use disableClear instead.
   */
  enableClear?: boolean;
}
