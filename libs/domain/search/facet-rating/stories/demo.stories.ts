import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { FacetListService } from '@spryker-oryx/search';
import { SearchFacetComponentAttributes } from '@spryker-oryx/search/facet';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Facet Rating`,
  args: {
    open: true,
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
};

const Template: Story<SearchFacetComponentAttributes> = (
  attrs
): TemplateResult => {
  resolve(FacetListService);

  const router = resolve(RouterService) as unknown as MockRouterService;
  router.params$.next({});

  return html`<oryx-search-facet-rating
    name="Rating"
    ?open=${attrs.open}
  ></oryx-search-facet-rating>`;
};

export const Demo = Template.bind({});
