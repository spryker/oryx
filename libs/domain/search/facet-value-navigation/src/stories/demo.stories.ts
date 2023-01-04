import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { FacetValueNavigationComponentAttributes } from '../facet-value-navigation.model';

export default {
  title: `${storybookPrefix}/Facet Value Navigation`,
} as unknown as Meta;

const Template: Story<FacetValueNavigationComponentAttributes> = (
  attrs: FacetValueNavigationComponentAttributes
): TemplateResult => {
  return html`<oryx-search-facet-value-navigation
    .heading=${attrs.heading}
    .valuesLength=${attrs.valuesLength}
    .selectedLength=${attrs.selectedLength}
    .enableToggle=${attrs.enableToggle}
    .enableSearch=${attrs.enableSearch}
    .open=${attrs.open}
  >
    Any value
  </oryx-search-facet-value-navigation>`;
};

export const Demo = Template.bind({});

Demo.args = {
  heading: 'Heading',
  valuesLength: 0,
  selectedLength: 0,
  enableToggle: false,
  enableSearch: false,
  open: true,
};
