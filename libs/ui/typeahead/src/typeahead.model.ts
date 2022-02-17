import { SearchOptions } from '../../search';

export interface TypeaheadOptions extends SearchOptions {
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
