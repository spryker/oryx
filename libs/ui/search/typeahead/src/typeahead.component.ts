import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  AffixOptions,
  ErrorOptions,
  FormControlController,
  FormControlOptions,
} from '../../../form/input';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchboxController,
  SearchIconPosition,
  SearchOptions,
} from '../../searchbox';
import { SearchboxComponent } from '../../searchbox/src/searchbox.component';
import { TypeaheadController } from './controllers';
import { FilterStrategyType, TypeaheadOptions } from './typeahead.model';
import { typeaheadStyles } from './typeahead.styles';

@hydratable('focusin')
export class TypeaheadComponent
  extends LitElement
  implements
    TypeaheadOptions,
    AffixOptions,
    ErrorOptions,
    FormControlOptions,
    SearchOptions
{
  static styles = [typeaheadStyles, ...SearchboxComponent.styles];

  @property() filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;
  @property() label?: string;
  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property() prefixIcon?: string;
  @property({ type: Boolean }) prefixFill?: boolean;
  @property() suffixIcon?: string;
  @property({ type: Boolean }) suffixFill?: boolean;
  @property() searchIcon?: string;
  @property() searchIconPosition?: SearchIconPosition;
  @property() clearIcon?: string;
  @property({ reflect: true }) clearIconPosition?: ClearIconPosition;
  @property() clearIconAppearance?: ClearIconAppearance;

  protected typeaheadController = new TypeaheadController(this);
  protected formControlController = new FormControlController(this);
  protected searchController = new SearchboxController(this);

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
