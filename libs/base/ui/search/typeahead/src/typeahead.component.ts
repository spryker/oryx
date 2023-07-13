import {
  AffixOptions,
  ErrorOptions,
  FormControlController,
  FormControlOptions,
} from '@spryker-oryx/ui/input';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchAttributes,
  SearchboxController,
  SearchIconPosition,
} from '@spryker-oryx/ui/searchbox';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { TypeaheadController } from './controllers';
import { FilterStrategyType, TypeaheadOptions } from './typeahead.model';
import { baseStyles } from './typeahead.styles';

@hydratable({ event: 'focusin' })
export class TypeaheadComponent
  extends LitElement
  implements
    TypeaheadOptions,
    AffixOptions,
    ErrorOptions,
    FormControlOptions,
    SearchAttributes
{
  static styles = baseStyles;

  @property() filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;
  @property({ reflect: true }) label?: string;
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
