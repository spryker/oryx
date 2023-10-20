import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { SearchFacetComponentAttributes } from '@spryker-oryx/search/facet';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SearchRatingFacetComponentOptions } from '../facet-rating.model';

export default {
  title: `${storybookPrefix}/Facet Rating`,
  args: {
    open: true,
    min: 1,
    max: 5,
    scale: 5,
  },
  argTypes: {
    min: {
      table: { category: 'Options' },
    },
    max: {
      table: { category: 'Options' },
    },
    scale: {
      table: { category: 'Options' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
};

const Template: Story<
  SearchFacetComponentAttributes & SearchRatingFacetComponentOptions
> = ({ open, min, max, scale }): TemplateResult => {
  resolve<MockRouterService>(RouterService).params$.next({});

  return html`<oryx-search-facet-rating
    name="Rating"
    ?open=${open}
    .options=${{
      min,
      max,
      scale,
    }}
  ></oryx-search-facet-rating>`;
};

export const Demo = Template.bind({});
