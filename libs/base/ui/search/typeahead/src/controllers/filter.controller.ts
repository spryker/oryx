import { OptionComponent } from '@spryker-oryx/ui/option';
import { POPOVER_EVENT, PopoverSelectEvent } from '@spryker-oryx/ui/popover';
import { getControl } from '@spryker-oryx/ui/utilities';
import { LitElement, ReactiveController } from 'lit';
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
    this.host.addEventListener('change', this.onChange);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('keydown', this.onKeydown);
    this.host.removeEventListener('input', this.onInput as EventListener);
    this.host.removeEventListener('focusout', this.onFocusOut);
    this.host.removeEventListener('change', this.onChange);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (
      this.host.filterStrategy &&
      e.key === ' ' &&
      this.controlItem.value === ''
    ) {
      e.preventDefault();
    }
  }

  protected onFocusOut(): void {
    if (this.host.filterStrategy) {
      const hasSelectedItem = this.items.find((item) => item.active);
      if (!hasSelectedItem) {
        this.clearInput();
      }
    }
  }

  protected onInput(e: InputEvent): void {
    if (this.host.filterStrategy && e.inputType) {
      this.filterOptionsByValue(
        e.inputType === 'deleteContentBackward' && !this.controlItem.value
          ? ''
          : this.controlItem.value
      );
    }
  }

  hostUpdated(): void {
    if (this.host.filterStrategy && this.filterValue) {
      this.filterOptionsByValue(this.controlItem.value);
    }
  }

  protected clearInput(): void {
    if (this.control) {
      this.control.value = '';
      if (this.host.filterStrategy) {
        this.filterOptionsByValue(this.control.value);
      }

      this.control.dispatchEvent(
        new Event(
          this.control instanceof HTMLSelectElement ? 'change' : 'input',
          { bubbles: true, composed: true }
        )
      );
    }
  }

  protected setEmptyState(value: boolean): void {
    const isEmpty = !!this.host.isEmpty;
    // set isEmpty to true when there are no visible items
    // and - when changed - ensure that the state is taken into account in the host
    if (isEmpty !== value) {
      this.host.isEmpty = value;
      this.host.requestUpdate('isEmpty', isEmpty);
    }
  }

  protected onChange(): void {
    if (this.filterValue === this.controlItem.value) {
      return;
    }

    this.filterOptions('', true);
  }

  protected filterOptions(value = '', omitDispatchEvent?: boolean): void {
    if (!this.host.filterStrategy) {
      return;
    }

    let visibleOptionCount = 0;
    const strategy = this.strategies[this.host.filterStrategy];

    this.items.forEach((item) => {
      const itemValue = item.innerText || item.value;
      if (itemValue) {
        const indexes = [
          ...itemValue.matchAll(getFilterRegExp(value, strategy)),
        ].map((a) => a.index);

        item.toggleAttribute('hide', indexes.length === 0);
        if (!item.hasAttribute('hide')) {
          item.innerHTML = generateMarkedHtml(
            indexes as number[],
            itemValue,
            value,
            strategy
          );
          visibleOptionCount++;
        }
      }
    });

    if (!omitDispatchEvent) {
      this.dispatchMatchEvent(visibleOptionCount, value);
    }

    this.setEmptyState(visibleOptionCount === 0);
  }

  protected filterOptionsByValue(value = ''): void {
    if (this.filterValue === value || (!this.filterValue && value === '')) {
      return;
    }

    this.filterValue = value;

    this.filterOptions(value);
  }

  protected dispatchMatchEvent(
    visibleOptionCount: number,
    value: string
  ): void {
    let selected: HTMLElement | undefined;
    if (visibleOptionCount === 1) {
      const option = this.items.find((el) => !el.hasAttribute('hide'));
      const optionText = option?.innerText?.trim() || option?.value || '';
      if (optionText.toLowerCase() === value.toLowerCase()) {
        selected = option;
      }
    }

    const event = new CustomEvent<PopoverSelectEvent>(POPOVER_EVENT, {
      detail: {
        selected,
      },
      bubbles: true,
      composed: true,
    });

    this.control.dispatchEvent(event);
  }

  protected get control(): HTMLInputElement | HTMLSelectElement {
    return getControl(this.host, 'input, select');
  }

  protected get filterControl(): HTMLInputElement {
    return this.host.renderRoot.querySelector(
      '[filterInput]'
    ) as HTMLInputElement;
  }

  protected get controlItem(): HTMLInputElement | HTMLSelectElement {
    if (this.host.hasAttribute('filterSelect')) {
      return this.filterControl;
    } else {
      return this.control;
    }
  }

  protected get items(): OptionComponent[] {
    return Array.from(this.host.querySelectorAll('oryx-option'));
  }

  constructor(protected host: TypeaheadOptions & LitElement) {
    this.host.addController(this);

    this.onKeydown = this.onKeydown.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.onChange = this.onChange.bind(this);
  }
}
