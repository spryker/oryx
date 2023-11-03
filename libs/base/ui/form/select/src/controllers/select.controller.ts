import { TypeaheadOptions } from '@spryker-oryx/ui/typeahead';
import { getControl } from '@spryker-oryx/ui/utilities';
import { LitElement, ReactiveController } from 'lit';

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
  protected options: { value: string; text?: string; selected?: boolean }[] =
    [];

  hostUpdated(): void {
    this.initSelect();
    this.observeSelect();
  }

  protected initSelect(): void {
    const control = getControl(this.host);
    if (control instanceof HTMLSelectElement) this.reflectSelect(control);
    else {
      control.toggleAttribute(
        'readonly',
        this.host.filterStrategy === undefined ||
          (this.host.filterStrategy as string) === ''
      );
    }
  }

  protected reflectSelect(element: HTMLSelectElement): void {
    const options = Array.from(element.options)
      .filter((option) => option.value !== '')
      .map((nativeOption: HTMLOptionElement) => {
        nativeOption.hidden = true;
        const reflectedOption: {
          value: string;
          text?: string;
          selected?: boolean;
        } = {
          value: nativeOption.value,
        };
        const text = nativeOption.textContent?.trim();
        if (text !== '' && text !== nativeOption.value)
          reflectedOption.text = text;

        if (nativeOption.selected) reflectedOption.selected = true;

        return reflectedOption;
      });

    if (JSON.stringify(options) !== JSON.stringify(this.options)) {
      this.options = options;
      this.reflectOptions();
    }

    this.host.isEmpty =
      (this.host.isEmpty && this.host.hasAttribute('filterselect')) ||
      (!this.host.isLoading && this.options.length === 0);
  }

  protected reflectOptions(): void {
    this.clearOptions();
    this.options.forEach((option) => {
      const newOption = `<oryx-option value='${option.value}' ${
        option.selected ? 'active' : ''
      } slot="option">${option.text ?? option.value}</oryx-option>`;
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
      this.host.requestUpdate();
    });
    this.mutationObserver.observe(getControl(this.host), {
      childList: true,
      subtree: true,
      attributeFilter: ['selected'],
    });
  }

  hostDisconnected(): void {
    this.mutationObserver?.disconnect();
  }

  constructor(protected host: LitElement & TypeaheadOptions) {
    this.host.addController(this);
  }
}
