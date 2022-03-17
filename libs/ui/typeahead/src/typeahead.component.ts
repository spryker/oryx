import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  AffixOptions,
  ErrorOptions,
  FormControlController,
  FormControlOptions,
  LabelOptions,
} from '../../input';
import { PopoverController } from '../../popover';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchController,
  SearchIconPosition,
  SearchOptions,
} from '../../search';
import { SearchComponent } from '../../search/src/search.component';
import { TypeaheadController } from './typeahead.controller';
import { FilterStrategyType, TypeaheadOptions } from './typeahead.model';
import { typeaheadStyles } from './typeahead.styles';

export class TypeaheadComponent
  extends LitElement
  implements
    TypeaheadOptions,
    LabelOptions,
    AffixOptions,
    ErrorOptions,
    FormControlOptions,
    SearchOptions
{
  static styles = [typeaheadStyles, ...SearchComponent.styles];

  @property({ type: Boolean }) filter?: boolean;
  @property({ type: Number }) filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;
  @property() label?: string;
  @property() errorMessage?: string;
  @property() prefixIcon?: string;
  @property({ type: Boolean }) prefixFill?: boolean;
  @property() suffixIcon?: string;
  @property({ type: Boolean }) suffixFill?: boolean;
  @property() searchIcon?: string;
  @property() searchIconPosition?: SearchIconPosition;
  @property() clearIcon?: string;
  @property() clearIconPosition?: ClearIconPosition;
  @property() clearIconAppearance?: ClearIconAppearance;

  protected typeaheadController = new TypeaheadController(this);
  protected formControlController = new FormControlController(this);
  protected searchController = new SearchController(this);
  protected popoverController = new PopoverController(this);

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.searchController.renderPrefix(),
        after: this.searchController.renderSuffix(),
      })}
      ${this.typeaheadController.renderPopover()}
    `;
  }
}
