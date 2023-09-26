import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RangeFacetValue } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SearchFacetRangeComponentAttributes } from '../facet-range.model';

export default {
  title: `${storybookPrefix}/Facet Range`,
};

const Template: Story<SearchFacetRangeComponentAttributes> = (
  props
): TemplateResult => {
  const router = resolve<MockRouterService>(RouterService);

  router.params$.next({});

  const setPrice = (e: CustomEvent<SelectFacetEventDetail>): void => {
    const { min, max } = (e.detail.value?.selected as RangeFacetValue) ?? {};

    router.params$.next(
      max ? { minPrice: String(min), maxPrice: String(max) } : {}
    );
  };

  return html`<oryx-search-range-facet
    name="Range"
    .step=${props.step}
    .labelMin=${props.labelMin}
    .labelMax=${props.labelMax}
    ?open=${props.open}
    ?enableClear=${props.enableClear}
    @oryx.select=${setPrice}
  ></oryx-search-range-facet>`;
};

export const Demo = Template.bind({});

Demo.args = {
  open: true,
  enableClear: true,
  step: 1,
  labelMin: 'Min',
  labelMax: 'Max',
};

Demo.argTypes = {
  step: {
    type: 'number',
  },
};
