import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Constructor } from '../../utilities/model';
import { SearchController } from './search.controller';
import { SearchIconPosition, SearchInterface } from './search.model';

export const SearchMixin = <T extends Constructor<LitElement>>(
  superClass: T
): Constructor<SearchInterface> & T => {
  class SearchClass extends superClass {
    searchController = new SearchController(this);

    @property() searchIconPosition?: SearchIconPosition;
    @property() searchIcon?: string;
    @property() clearIcon?: string;
  }

  return SearchClass as unknown as Constructor<SearchInterface> & T;
};
