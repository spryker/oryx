import { IconTypes } from '@spryker-oryx/ui/icon';
import { ErrorOptions, FormControlController } from '@spryker-oryx/ui/input';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchAttributes,
  SearchboxController,
  SearchIconPosition,
} from '@spryker-oryx/ui/searchbox';
import {
  FilterStrategyType,
  TypeaheadController,
  TypeaheadOptions,
} from '@spryker-oryx/ui/typeahead';
import { getControl } from '@spryker-oryx/ui/utilities';
import { hydrate } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { SelectController, SelectFilterController } from './controllers';
import { baseStyles } from './styles';

@hydrate({ event: ['mouseover', 'focus'] })
export class SelectComponent
  extends LitElement
  implements ErrorOptions, SearchAttributes, TypeaheadOptions
{
  static styles = baseStyles;

  @property({ type: Boolean }) filter?: boolean;
  @property() filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property({ reflect: true }) label?: string;
  @property() errorMessage?: string;
  @property() prefixIcon?: string;
  @property({ type: Boolean }) prefixFill?: boolean;
  @property() suffixIcon?: string = IconTypes.Dropdown;
  @property({ type: Boolean }) suffixFill?: boolean;
  @property() searchIcon?: string;
  @property() searchIconPosition?: SearchIconPosition = SearchIconPosition.None;
  @property() clearIcon?: string;
  @property() clearIconPosition?: ClearIconPosition;
  @property() clearIconAppearance?: ClearIconAppearance =
    ClearIconAppearance.Hover;

  /**
   * Sets the value of the select element and dispatches
   * a change event to ensure that the select component will
   * reflect the state.
   */
  setValue(value: string): void {
    const control = getControl(this);
    if (control.value === value) {
      return;
    }
    control.value = value;
    control.dispatchEvent(
      new Event('change', { bubbles: true, composed: true })
    );
  }

  protected selectController = new SelectController(this);
  protected selectFilterController = new SelectFilterController(this);
  protected typeaheadController = new TypeaheadController(this, {
    showOnFocus: false,
  });
  protected searchController = new SearchboxController(this);
  protected formControlController = new FormControlController(this);

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.renderPrefix(),
        after: this.searchController.renderSuffix(),
      })}
      ${this.typeaheadController.renderPopover()}
    `;
  }

  protected updated(): void {
    this.clearIconPosition = this.allowEmptyValue
      ? ClearIconPosition.Suffix
      : ClearIconPosition.None;
  }

  protected renderPrefix(): TemplateResult {
    return html`${this.searchController.renderPrefix()}${this.selectFilterController.render()}`;
  }

  protected get allowEmptyValue(): boolean {
    const control = getControl<HTMLInputElement | HTMLSelectElement>(this);
    return (
      control instanceof HTMLInputElement || control.options?.[0]?.value === ''
    );
  }
}
