import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Entries`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<cart-entries .options=${{ cartId: 'multiple' }}></cart-entries>`;
};

export const Demo = Template.bind({});

Demo.parameters = {
  chromatic: { disableSnapshot: true },
};
