export interface TypeaheadOptions {
  /**
   * When enabled, the options can be filtered client side. This means that the
   * available options in the UI are filtered by the input control.
   *
   * A typeahead component with filter enabled acts similar to a html5 input control
   * with datalist.
   *
   * Defaults to `false`.
   */
  filter?: boolean;

  /**
   * A filter strategy can be selected to choose between
   */
  filterStrategy?: FilterStrategyType;

  /**
   * Indicates that the typeahead content is loading. This will show
   * a loader icon in the slot, unless a custom loader is projected
   * in the `loading` slot.
   */
  isLoading?: boolean;

  /**
   * Indicates whether there are no options. The `isEmpty` flag will
   * force an empty message in popover UI.
   *
   * Alternatively, the `empty` slot can be used. When content is projected
   * in the `empty` slot, the `isEmpty` flag is obsolete.
   */
  isEmpty?: boolean;

  /**
   * Provides easy option to ad a (localised) empty message, when there are
   * no options available. This message will only be shown in combination
   * with the `isEmpty` message.
   *
   * Alternatively, the `empty` slot can be used.
   */
  emptyMessage?: string;
}

export interface OptionSelectEvent {
  option: HTMLElement;
}

export const enum FilterStrategyType {
  START_WITH,
  START_OF_WORD,
  CONTAINS,
}
export interface FilterStrategy {
  type: FilterStrategyType;
  delimiters: string[];
}
