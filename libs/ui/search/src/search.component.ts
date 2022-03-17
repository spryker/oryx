import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  AffixOptions,
  FormControlController,
  FormControlOptions,
  inputStyles,
} from '../../input';
import { SearchController } from './search.controller';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchIconPosition,
  SearchOptions,
} from './search.model';
import { searchStyles } from './search.styles';

export class SearchComponent
  extends LitElement
  implements SearchOptions, FormControlOptions, AffixOptions
{
  static override styles = [...inputStyles, searchStyles];

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

  protected formControlController = new FormControlController(this);
  protected searchController = new SearchController(this);

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.searchController.renderPrefix(),
        after: this.searchController.renderSuffix(),
      })}
    `;
  }
}
