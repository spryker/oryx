import { FacetValue } from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
// use relative path for dev ssr server, SearchFacetComponent and searchFacetStyles is undefined
import { SearchFacetComponent } from '../facet/facet.component';
import { searchFacetStyles } from '../facet/facet.styles';
import { searchRangeFacetStyles } from './facet-range.styles';

export class SearchRangeFacetComponent extends SearchFacetComponent {
  static styles = [searchFacetStyles, searchRangeFacetStyles];

  protected override renderValueControlLabel(
    facetValue: FacetValue
  ): TemplateResult {
    console.log(this.name);
    
    return html`
      
    `;
  }
}
