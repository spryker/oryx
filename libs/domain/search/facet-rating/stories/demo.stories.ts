import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { SearchFacetComponentAttributes, SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SearchRatingFacetComponentProperties } from '../facet-rating.model';
import { MultiRangeChangeEvent } from '@spryker-oryx/ui/multi-range';
import { RangeFacetValue } from '@spryker-oryx/product';

export default {
  title: `${storybookPrefix}/Facet Rating`,
  args: {
    open: true,
    min: 1,
    max: 5,
    scale: 5,
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
};

const Template: Story<SearchRatingFacetComponentProperties> = (
  { open, min, max, scale }
): TemplateResult => {
  const router = resolve<MockRouterService>(RouterService);

  router.params$.next({});

  const select = (e: CustomEvent<SelectFacetEventDetail>): void => {
    const { min } = (e.detail.value?.selected as RangeFacetValue) ?? {};

    router.params$.next({ minRating: String(min) })
  };

  return html`<oryx-search-facet-rating
    name="Rating"
    ?open=${open}
    min=${min}
    max=${max}
    scale=${scale}
    @oryx.select=${select}
  ></oryx-search-facet-rating>`;
};

export const Demo = Template.bind({});
