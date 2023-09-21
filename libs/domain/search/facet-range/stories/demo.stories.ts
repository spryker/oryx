import {
  SearchFacetComponentAttributes,
} from '@spryker-oryx/search/facet';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Facet Range`,
};

const Template: Story<SearchFacetComponentAttributes> = (
  props
): TemplateResult => {
  return html`<oryx-search-range-facet
    name=${props.name}
    ?open=${props.open}
  ></oryx-search-range-facet>`;
};

export const Demo = Template.bind({});

Demo.args = {
  name: 'range',
  open: true,
};