import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ErrorOptions, FormControlController } from '../../../form/input';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchboxController,
  SearchIconPosition,
  SearchOptions,
} from '../../../search/searchbox';
import { SearchboxComponent } from '../../../search/searchbox/src/searchbox.component';
import {
  FilterStrategyType,
  TypeaheadController,
  TypeaheadOptions,
  typeaheadStyles,
} from '../../../search/typeahead';
import { getControl } from '../../utilities/getControl';
import { SelectController, SelectFilterController } from './controllers';
import { selectFilterStyles, selectStyles } from './styles';
import { selectFloatingLabelStyles } from './styles/select-floating-label.styles';

export class SelectComponent
  extends LitElement
  implements ErrorOptions, SearchOptions, TypeaheadOptions
{
  static styles = [
    selectStyles,
    selectFilterStyles,
    typeaheadStyles,
    ...SearchboxComponent.styles,
    selectFloatingLabelStyles,
  ];

  @property({ type: Boolean }) filter?: boolean;
  @property() filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property() label?: string;
  @property() errorMessage?: string;
  @property() prefixIcon?: string;
  @property({ type: Boolean }) prefixFill?: boolean;
  @property() suffixIcon?: string = 'dropdown';
  @property({ type: Boolean }) suffixFill?: boolean;
  @property() searchIcon?: string;
  @property() searchIconPosition?: SearchIconPosition = SearchIconPosition.NONE;
  @property() clearIcon?: string;
  @property() clearIconPosition?: ClearIconPosition;
  @property() clearIconAppearance?: ClearIconAppearance =
    ClearIconAppearance.HOVER;

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
      ? ClearIconPosition.SUFFIX
      : ClearIconPosition.NONE;
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
