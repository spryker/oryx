import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { Props } from '../id.model';

export default {
  title: `${storybookPrefix}/Id`,
} as unknown as Meta;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-id
    .sku=${props.sku}
    .options=${{ prefix: props.prefix }}
  ></product-id>`;
};

export const IdDemo = Template.bind({});

IdDemo.args = {
  sku: '1',
  prefix: 'SKU',
};
