import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Password/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-password-input label="label">
    <input type="password" value="Change123$" placeholder="Placeholder..." />
  </oryx-password-input>`;
};

export const Invisible = Template.bind({});
