import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { SearchFacetComponentAttributes } from '@spryker-oryx/search/facet';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Facet Range`,
};

const Template: Story<SearchFacetComponentAttributes> = (
  props
): TemplateResult => {
  const router = resolve<MockRouterService>(RouterService);

  router.params$.next({});

  return html`<oryx-search-range-facet
    name=${props.name}
    ?open=${props.open}
  ></oryx-search-range-facet>`;
};

export const Demo = Template.bind({});

Demo.args = {
  name: 'Range',
  open: true,
};
