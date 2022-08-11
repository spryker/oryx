import {
  AffixOptions,
  FormControlController,
  FormControlOptions,
  inputStyles,
} from '@spryker-oryx/ui/input';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { SearchboxController } from './searchbox.controller';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchIconPosition,
  SearchOptions,
} from './searchbox.model';
import { searchboxStyles } from './searchbox.styles';

export class SearchboxComponent
  extends LitElement
  implements SearchOptions, FormControlOptions, AffixOptions
{
  static override styles = [...inputStyles, searchboxStyles];

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
  @property() clearIconPosition?: ClearIconPosition;
  @property() clearIconAppearance?: ClearIconAppearance;

  protected formControlController = new FormControlController(this);
  protected searchController = new SearchboxController(this);

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.searchController.renderPrefix(),
        after: this.searchController.renderSuffix(),
      })}
    `;
  }
}
