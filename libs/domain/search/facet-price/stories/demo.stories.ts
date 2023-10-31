import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RangeFacetValue } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { SearchFacetRangeComponentAttributes } from '@spryker-oryx/search/facet-range';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Facet Price`,
  args: {
    open: true,
    disableClear: false,
    step: 1,
    labelMin: 'min-<currency>',
    labelMax: 'max-<currency>',
  },
  argTypes: {
    step: {
      type: 'number',
    },
  },
};

const Template: Story<SearchFacetRangeComponentAttributes> = (
  props
): TemplateResult => {
  const router = resolve<MockRouterService>(RouterService);

  router.params$.next({});

  const select = (e: CustomEvent<SelectFacetEventDetail>): void => {
    const { min, max } = (e.detail.value?.selected as RangeFacetValue) ?? {};

    router.params$.next(
      max ? { minPrice: String(min), maxPrice: String(max) } : {}
    );
  };

  return html`<oryx-search-price-facet
    name="Price"
    .step=${props.step}
    .labelMin=${props.labelMin}
    .labelMax=${props.labelMax}
    ?open=${props.open}
    ?disableClear=${props.disableClear}
    @oryx.select=${select}
  ></oryx-search-price-facet>`;
};

export const Demo = Template.bind({});
