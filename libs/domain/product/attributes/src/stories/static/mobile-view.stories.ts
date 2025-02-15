import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Attributes/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <div style="margin-right: 100px; max-width:540px">
    <oryx-product-attributes
      sku=${7}
      .options=${{ columnCount: '1' }}
    ></oryx-product-attributes>
  </div>`;
};

export const MobileView = Template.bind({});
