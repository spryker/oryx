import { waitForShadowDom } from '@/tools/storybook';
import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { SearchRatingFacetComponent } from '@spryker-oryx/search/facet-rating';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Facet Rating/Static`,
};

const Template: Story = (): TemplateResult => {
  resolve<MockRouterService>(RouterService).params$.next({});

  return html`
    <h4>Default</h4>
    <oryx-search-facet-rating
      name="Rating"
      open
    ></oryx-search-facet-rating>

    <h4>Selected value</h4>
    <oryx-search-facet-rating
      name="RatingPreselected"
      open
    ></oryx-search-facet-rating>
  `;
};



export const SelectedOption = Template.bind({});