import { LitElement, ReactiveController } from 'lit';
import { getControl } from '../../input';
import { TypeaheadOptions } from '../../typeahead';
import { SelectOptions } from './select.model';

/**
 * Whenever a select element is projected in the default slot, this controller
 * will reflect the native select options by generating a list of `oryx-option` elements.
 * The options are reflected repeatedly whenever the host is updated, so that options that
 * are added dynamically (async) will be reflected.
 *
 * If an input element is used, the input will be made `readonly`, unless filtering is enabled.
 *
 */
export class SelectController implements ReactiveController {
  protected options: { value: string; text?: string }[] = [];

  hostUpdated(): void {
    this.initSelect();
    this.observeSelect();
  }

  protected initSelect(): void {
    const control = getControl(this.host);
    if (control instanceof HTMLSelectElement) {
      this.reflectSelect(control);
    } else {
      if (!this.host.filterStrategy && !control.readOnly) {
        control.toggleAttribute('readonly', true);
      }
    }
  }

  protected reflectSelect(element: HTMLSelectElement): void {
    if (this.host.allowEmptyValue) {
      const firstOption = Array.from(element.options)?.[0];
      if (firstOption && firstOption.value !== '') {
        const emptyOption = document.createElement('option');
        emptyOption.hidden = true;
        // when an other option is selected, we do not force the selection of the
        // newly created empty option
        if (firstOption.selected) {
          emptyOption.selected = true;
        }
        element.insertBefore(emptyOption, firstOption);
      }
    }

    const options = Array.from(element.options)
      .filter((option) => option.value !== '')
      .map((nativeOption: HTMLOptionElement) => {
        nativeOption.hidden = true;
        const reflectedOption: { value: string; text?: string } = {
          value: nativeOption.value,
        };
        if (nativeOption.innerText.trim() !== '') {
          reflectedOption.text = nativeOption.innerText.trim();
        }
        return reflectedOption;
      });

    if (JSON.stringify(options) !== JSON.stringify(this.options)) {
      this.options = options;
      this.reflectOptions();
    }

    this.host.isEmpty = !this.host.isLoading && this.options.length === 0;
  }

  protected reflectOptions(): void {
    this.clearOptions();
    this.options.forEach((option) => {
      const newOption = `<oryx-option value="${option.value}" slot="option">${option.text}</oryx-option>`;
      this.host.insertAdjacentHTML('beforeend', newOption);
    });
  }

  protected clearOptions(): void {
    this.host.querySelectorAll('oryx-option').forEach((el) => el.remove());
  }

  protected mutationObserver?: MutationObserver;

  protected observeSelect(): void {
    this.mutationObserver?.disconnect();
    this.mutationObserver = new MutationObserver(() => {
      this.initSelect();
    });
    this.mutationObserver.observe(getControl(this.host), {
      childList: true,
    });
  }

  hostDisconnected(): void {
    this.mutationObserver?.disconnect();
  }

  constructor(protected host: SelectOptions & LitElement & TypeaheadOptions) {
    this.host.addController(this);
  }
}
