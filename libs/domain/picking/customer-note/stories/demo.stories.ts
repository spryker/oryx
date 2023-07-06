import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Customer note`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-customer-note pickingListId="withCartNote"></oryx-customer-note>
  `;
};

export const Demo = Template.bind({});
