import {
  AffixOptions,
  FormControlController,
  FormControlOptions,
} from '@spryker-oryx/ui/input';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { SearchboxController } from './searchbox.controller';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchAttributes,
  SearchIconPosition,
} from './searchbox.model';
import { baseStyles } from './searchbox.styles';

export class SearchboxComponent
  extends LitElement
  implements SearchAttributes, FormControlOptions, AffixOptions
{
  static override styles = baseStyles;

  @property({ reflect: true, type: Boolean }) open?: boolean;
  @property({ type: Boolean, attribute: 'xs-floated' }) xsFloated?: boolean;
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
  @property() backIcon?: string;

  protected formControlController = new FormControlController(this);
  protected searchController = new SearchboxController(this);

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.searchController.renderPrefix(),
        after: this.searchController.renderSuffix(),
      })}
      ${this.searchController.renderTrigger()}
    `;
  }
}
