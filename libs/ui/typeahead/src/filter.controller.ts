import { getControl } from '../../input/src/util';
import { OptionComponent } from '../../option';
import { OryxElement } from '../../utilities';
import { generateMarkedHtml, getFilterRegExp } from './filter.utils';
import { FilterStrategyType, TypeaheadOptions } from './typeahead.model';
import { ReactiveController } from 'lit';

/**
 * Provides filtering of options client side, so that the user is able to quickly
 * filter a (long) list of options by the given input characters.
 *
 * Filtering can be enabled by using the `filter` flag on the `TypeaheadOption`.
 */
export class FilterController implements ReactiveController {
  protected filterValue?: string;

  protected strategies = {
    [FilterStrategyType.START_OF_WORD]: {
      type: FilterStrategyType.START_OF_WORD,
      delimiters: [' ', '/', '-', '_'],
    },
    [FilterStrategyType.START_WITH]: {
      type: FilterStrategyType.START_WITH,
      delimiters: ['/'],
    },
    [FilterStrategyType.CONTAINS]: {
      type: FilterStrategyType.CONTAINS,
      delimiters: [],
    },
  };

  hostConnected(): void {
    if (this.host.options.filter) {
      this.host.addEventListener('input', () => {
        this.filterOptionsByValue(getControl(this.host)?.value);
      });
    }
  }

  hostUpdated(): void {
    if (this.host.options.filter) {
      this.filterOptionsByValue(getControl(this.host)?.value);
    }
  }

  protected filterOptionsByValue(value = ''): void {
    if (this.filterValue === value) {
      return;
    }
    this.filterValue = value;

    const strategy =
      this.strategies[
        this.host.options.filterStrategy ?? FilterStrategyType.START_OF_WORD
      ];

    let visibleOptionCount = 0;

    this.items.forEach((item) => {
      if (item.value) {
        const indexes = [
          ...item.value.matchAll(getFilterRegExp(value, value, strategy)),
        ].map((a) => a.index);

        item.hide = indexes.length === 0;
        if (!item.hide) {
          item.innerHTML = generateMarkedHtml(
            indexes as number[],
            item.value,
            value,
            strategy
          );
          visibleOptionCount++;
        }
      }
    });

    const isEmpty = this.host.options.isEmpty;
    // set isEmpty to true when there are no visible items
    // and - when changed - ensure that the state is taken into account in the host
    this.host.options = {
      ...this.host.options,
      isEmpty: visibleOptionCount === 0,
    };
    if (isEmpty !== this.host.options.isEmpty) {
      this.host.requestUpdate('options');
    }
  }

  constructor(protected host: OryxElement<TypeaheadOptions>) {
    this.host.addController(this);
  }

  protected get items(): OptionComponent[] {
    return Array.from(this.host.querySelectorAll('oryx-option'));
  }
}
