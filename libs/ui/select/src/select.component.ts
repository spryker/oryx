import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ErrorOptions, FormControlController, getControl } from '../../input';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchController,
  SearchIconPosition,
  SearchOptions,
} from '../../search';
import { SearchComponent } from '../../search/src/search.component';
import {
  FilterStrategyType,
  TypeaheadController,
  TypeaheadOptions,
  typeaheadStyles,
} from '../../typeahead';
import { SelectController } from './select.controller';
import { SelectOptions } from './select.model';
import { selectStyles } from './select.styles';

export class SelectComponent
  extends LitElement
  implements ErrorOptions, SearchOptions, TypeaheadOptions, SelectOptions
{
  static styles = [selectStyles, typeaheadStyles, ...SearchComponent.styles];

  @property({ type: Boolean }) filter?: boolean;
  @property() filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property({ type: Boolean }) allowEmptyValue?: boolean;
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

  protected selectController = new SelectController(this);
  protected typeaheadController = new TypeaheadController(this, {
    showOnFocus: false,
  });
  protected searchController = new SearchController(this);
  protected formControlController = new FormControlController(this);

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.searchController.renderPrefix(),
        after: this.searchController.renderSuffix(),
      })}
      ${this.typeaheadController.renderPopover()}
    `;
  }

  protected updated(): void {
    this.clearIconPosition =
      getControl(this) instanceof HTMLInputElement || this.allowEmptyValue
        ? ClearIconPosition.SUFFIX
        : ClearIconPosition.NONE;
  }
}
