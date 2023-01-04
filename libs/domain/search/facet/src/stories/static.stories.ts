import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/experience';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { Meta } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { FacetComponentAttributes } from '../facet.model';

const facetComponent = (attrs: FacetComponentAttributes): TemplateResult => {
  return html`<oryx-search-facet
    .name=${attrs.name ?? 'Brand'}
    .minForSearch=${attrs.minForSearch}
    .renderLimit=${attrs.renderLimit ?? 20}
    ?open=${attrs.open}
    ?multi=${attrs.multi}
  ></oryx-search-facet>`;
};

export default {
  title: `${storybookPrefix}/Facet/Static`,
} as unknown as Meta;

const Template = (): TemplateResult => {
  const router = resolve(RouterService) as unknown as MockRouterService;

  router.params$.next({ category: 'Category0,Category2' });

  return html`
    <style>
      .row {
        display: flex;
        gap: 15px;
        margin-block-end: 20px;
      }

      .row > * {
        width: 50%;
      }
    </style>

    <h3>Close/Open by default</h3>
    <div class="row">
      ${facetComponent({})} ${facetComponent({ open: true })}
    </div>

    <h3>Single/Multi</h3>
    <div class="row">
      ${facetComponent({ open: true })}
      ${facetComponent({ multi: true, open: true })}
    </div>

    <h3>Without/With toggle button</h3>
    <div class="row">
      ${facetComponent({ open: true })}
      ${facetComponent({ renderLimit: 5, open: true })}
    </div>

    <h3>Without/With search</h3>
    <div class="row">
      ${facetComponent({ open: true })}
      ${facetComponent({ minForSearch: 13, open: true })}
    </div>

    <h3>Selected</h3>
    ${facetComponent({
      name: 'Category',
      multi: true,
      renderLimit: 5,
      open: true,
    })}
  `;
};

export const Static = Template.bind({});
