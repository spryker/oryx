import { html, TemplateResult } from 'lit';
import { inputMixin, inputStyles } from '../../input';
import { SearchMixin } from './search.mixin';
import { searchStyles } from './search.styles';

export class SearchComponent extends SearchMixin(inputMixin) {
  static override styles = [...inputStyles, searchStyles];

  protected override render(): TemplateResult {
    return html`
      ${this.renderLabel()}
      ${this.formControlController.render(
        this.searchController.renderPrefix(),
        this.searchController.renderSuffix()
      )}
      ${this.renderError()}
    `;
  }
}
