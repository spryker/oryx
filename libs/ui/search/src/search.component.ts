import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { FormControlController, inputStyles } from '../../input';
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
