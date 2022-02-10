import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  AffixController,
  FormControlController,
  inputStyles,
} from '../../input';
import { OryxElement } from '../../utilities';
import { SearchController } from './search.controller';
import { SearchOptions } from './search.model';
import { searchStyles } from './search.styles';

export class SearchComponent
  extends LitElement
  implements OryxElement<SearchOptions>
{
  static override styles = [...inputStyles, searchStyles];

  @property({ type: Object }) options: SearchOptions = {};

  protected formControlController = new FormControlController(this);
  protected affixController = new AffixController(this);
  protected searchController = new SearchController(this);

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.affixController.renderPrefix(
          this.searchController.prefixContent
        ),
        after: html` ${this.searchController.clearButton}
        ${this.affixController.renderSuffix(
          this.searchController.suffixContent
        )}`,
      })}
    `;
  }
}
