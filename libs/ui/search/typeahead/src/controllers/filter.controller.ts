import { LitElement, ReactiveController } from 'lit';
import { getControl } from '../../../../form/utilities';
import { OptionComponent } from '../../../../option';
import { PopoverSelectEvent } from '../../../../popover';
import { FilterStrategyType, TypeaheadOptions } from '../typeahead.model';
import { generateMarkedHtml, getFilterRegExp } from './filter.utils';

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
    this.host.addEventListener('keydown', this.onKeydown);
    this.host.addEventListener('input', this.onInput as EventListener);
    this.host.addEventListener('focusout', this.onFocusOut);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('keydown', this.onKeydown);
    this.host.removeEventListener('input', this.onInput as EventListener);
    this.host.removeEventListener('focusout', this.onFocusOut);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (
      this.host.filterStrategy &&
      e.key === ' ' &&
      this.control.value === ''
    ) {
      e.preventDefault();
    }
  }

  protected onFocusOut(): void {
    if (this.host.filterStrategy) {
      const hasSelectedItem = this.items.find((item) => item.selected);
      if (!hasSelectedItem) {
        this.clearInput();
      }
    }
  }

  protected onInput(e: InputEvent): void {
    if (this.host.filterStrategy && e.inputType) {
      this.filterOptionsByValue(this.control.value, this.host.filterStrategy);
    }
  }

  protected clearInput(): void {
    if (this.control) {
      this.control.value = '';
      if (this.host.filterStrategy) {
        this.filterOptionsByValue(this.control.value, this.host.filterStrategy);
      }
      this.control.dispatchEvent(
        new InputEvent('input', { bubbles: true, composed: true })
      );
    }
  }

  hostUpdated(): void {
    if (this.host.filterStrategy) {
      this.filterOptionsByValue(this.control.value, this.host.filterStrategy);
    }
  }

  protected filterOptionsByValue(
    value = '',
    strategyType: FilterStrategyType
  ): void {
    if (this.filterValue === value || (!this.filterValue && value === '')) {
      return;
    }
    this.filterValue = value;

    const strategy = this.strategies[strategyType];

    let visibleOptionCount = 0;

    this.items.forEach((item) => {
      if (item.value) {
        const indexes = [
          ...item.value.matchAll(getFilterRegExp(value, strategy)),
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

    this.dispatchMatchEvent(visibleOptionCount, value);

    const isEmpty = !!this.host.isEmpty;
    // set isEmpty to true when there are no visible items
    // and - when changed - ensure that the state is taken into account in the host
    if (isEmpty !== (visibleOptionCount === 0)) {
      this.host.isEmpty = visibleOptionCount === 0;
      this.host.requestUpdate('isEmpty', isEmpty);
    }
  }

  protected dispatchMatchEvent(
    visibleOptionCount: number,
    value: string
  ): void {
    let selected: HTMLElement | undefined;

    if (visibleOptionCount === 1) {
      const option = this.items.find((el) => !el.hide);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (option!.value!.toLowerCase() === value.toLowerCase()) {
        selected = option;
      }
    }

    const event = new CustomEvent<PopoverSelectEvent>('oryx.popover', {
      detail: {
        selected,
      },
      bubbles: true,
      composed: true,
    });

    this.control.dispatchEvent(event);
  }

  protected get control(): HTMLInputElement {
    return getControl(this.host, 'input');
  }

  protected get items(): OptionComponent[] {
    return Array.from(this.host.querySelectorAll('oryx-option'));
  }

  constructor(protected host: TypeaheadOptions & LitElement) {
    this.host.addController(this);

    this.onKeydown = this.onKeydown.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
  }
}
