import { FormControlController, getControl } from '../../input';
import { PopoverController } from '../../popover';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchController,
  SearchIconPosition,
} from '../../search';
import { SearchComponent } from '../../search/src/search.component';
import { TypeaheadController, typeaheadStyles } from '../../typeahead';
import { OryxElement } from '../../utilities';
import { SelectController } from './select.controller';
import { SelectOptions } from './select.model';
import { selectStyles } from './select.styles';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export class SelectComponent
  extends LitElement
  implements OryxElement<SelectOptions>
{
  static styles = [selectStyles, typeaheadStyles, ...SearchComponent.styles];

  private _options: SelectOptions = {};

  @property({ type: Object })
  get options(): SelectOptions {
    return {
      ...this.getDefaultOptions(),
      ...this._options,
    };
  }

  set options(val: SelectOptions) {
    const current = this._options;
    this._options = val;
    this.requestUpdate('options', current);
  }

  protected selectController = new SelectController(this);
  protected typeaheadController = new TypeaheadController(this);
  protected formControlController = new FormControlController(this);
  protected searchController = new SearchController(this);
  protected popoverController = new PopoverController(this, {
    showOnFocus: false,
  });

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.searchController.renderPrefix(),
        after: this.searchController.renderSuffix(),
      })}
      ${this.typeaheadController.renderPopover()}
    `;
  }

  protected getDefaultOptions(): SelectOptions {
    return {
      suffixIcon: 'dropdown',
      searchIconPosition: SearchIconPosition.NONE,
      clearIconPosition: this.clearIconPosition(),
      clearIconAppearance: ClearIconAppearance.HOVER,
    };
  }

  protected clearIconPosition(): ClearIconPosition {
    return this.isClearSelectValueAllowed()
      ? ClearIconPosition.SUFFIX
      : ClearIconPosition.NONE;
  }

  protected isClearSelectValueAllowed(): boolean {
    return (
      (getControl(this) instanceof HTMLInputElement &&
        (!!this._options.allowEmptyValue ||
          this._options.allowEmptyValue === undefined)) ||
      !!this._options.allowEmptyValue
    );
  }
}
