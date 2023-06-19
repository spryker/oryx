import { Facet, FacetValue } from '@spryker-oryx/product';

export const FACET_SELECT_EVENT = 'oryx.select';

export interface SelectFacetEventDetail {
  name: string;
  value?: Pick<FacetValue, 'value' | 'selected'>;
}

export interface SingleMultiFacet extends Omit<Facet, 'values'> {
  values: FacetValue[];
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
  enableClear?: boolean;
}
