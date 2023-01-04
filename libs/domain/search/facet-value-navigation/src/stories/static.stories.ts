import { Meta } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { FacetValueNavigationComponentAttributes } from '../facet-value-navigation.model';

export default {
  title: `${storybookPrefix}/Facet Value Navigation/Static`,
} as unknown as Meta;

const facetNavigationComponent = (
  attrs: FacetValueNavigationComponentAttributes
): TemplateResult => html`<oryx-search-facet-value-navigation
  heading="Heading"
  .valuesLength=${attrs.valuesLength}
  .selectedLength=${attrs.selectedLength}
  .enableToggle=${attrs.enableToggle}
  .enableSearch=${attrs.enableSearch}
  .open=${attrs.open}
>
  Any value
</oryx-search-facet-value-navigation>`;

const Template = (): TemplateResult => {
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
      ${facetNavigationComponent({})}
      ${facetNavigationComponent({ open: true })}
    </div>

    <h3>Without/With toggle button</h3>
    <div class="row">
      ${facetNavigationComponent({ open: true })}
      ${facetNavigationComponent({ open: true, enableToggle: true })}
    </div>

    <h3>Without/With toggle button</h3>
    <div class="row">
      ${facetNavigationComponent({ open: true })}
      ${facetNavigationComponent({ open: true, enableToggle: true })}
    </div>

    <h3>Without/With values length</h3>
    <div class="row">
      ${facetNavigationComponent({ open: true })}
      ${facetNavigationComponent({
        open: true,
        enableToggle: true,
        valuesLength: 15,
      })}
    </div>

    <h3>Without/With selected items</h3>
    <div class="row">
      ${facetNavigationComponent({})}
      ${facetNavigationComponent({ selectedLength: 10 })}
    </div>
  `;
};

export const Static = Template.bind({});
