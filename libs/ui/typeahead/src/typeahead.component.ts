import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { FormControlController } from '../../input';
import { PopoverController } from '../../popover';
import { SearchController } from '../../search';
import { SearchComponent } from '../../search/src/search.component';
import { OryxElement } from '../../utilities';
import { TypeaheadController } from './typeahead.controller';
import { TypeaheadOptions } from './typeahead.model';
import { typeaheadStyles } from './typeahead.styles';

export class TypeaheadComponent
  extends LitElement
  implements OryxElement<TypeaheadOptions>
{
  static styles = [typeaheadStyles, ...SearchComponent.styles];

  @property({ type: Object }) options: TypeaheadOptions = {};

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
