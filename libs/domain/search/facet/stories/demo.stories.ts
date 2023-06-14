import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { FacetListService } from '@spryker-oryx/search';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { take } from 'rxjs';
import { storybookPrefix } from '../../.constants';
import {
  SearchFacetComponentAttributes,
  SelectFacetPayload,
} from '../facet.model';

export default {
  title: `${storybookPrefix}/Facet`,
} as unknown as Meta;

const Template: Story<SearchFacetComponentAttributes> = (
  attrs
): TemplateResult => {
  const router = resolve(RouterService) as unknown as MockRouterService;
  const service = resolve(FacetListService);

  router.params$.next({});

  const onSelect = (e: CustomEvent<SelectFacetPayload>) => {
    const { name, value: selectedFacetValue } = e.detail;

    service
      .get()
      .pipe(take(1))
      .subscribe((facets) => {
        if (!selectedFacetValue) {
          router.params$.next({});
          return;
        }

        const facet = facets?.find((facet) => facet.name === name);

        const values = attrs?.multi
          ? [
              ...(facet?.selectedValues ?? []),
              ...(selectedFacetValue.selected
                ? [selectedFacetValue.value]
                : []),
            ].filter(
              (selectedValue) =>
                selectedFacetValue.selected ||
                selectedValue !== selectedFacetValue.value
            )
          : selectedFacetValue.selected
          ? [selectedFacetValue.value]
          : [];

        router.params$.next({ [facet?.parameter ?? '']: values.join(',') });
      });
  };

  return html`<oryx-search-facet
    .name=${attrs.name}
    .minForSearch=${attrs.minForSearch}
    .renderLimit=${attrs.renderLimit}
    ?open=${attrs.open}
    ?multi=${attrs.multi}
    @oryx.select=${onSelect}
  ></oryx-search-facet>`;
};

export const Demo = Template.bind({});

Demo.args = {
  name: 'Brand',
  multi: false,
  renderLimit: 5,
  minForSearch: 13,
  open: false,
};

Demo.argTypes = {
  name: {
    control: { type: 'select' },
    options: ['Brand', 'Category'],
  },
};
