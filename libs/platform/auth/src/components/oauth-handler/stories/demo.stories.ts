import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Oauth handler`,
} as Meta;

const Template: Story = (options): TemplateResult => {
  return html`
    <oryx-auth-oauth-handler></oryx-auth-oauth-handler>
  `;
};

export const Demo = Template.bind({});
