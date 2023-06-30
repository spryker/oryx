import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { resolve} from "@spryker-oryx/di";
import { MockAuthService} from "@spryker-oryx/auth/mocks";
export default {
  title: `${storybookPrefix}/Oauth handler`,
} as Meta;

const Template: Story = (options): TemplateResult => {
  const authService = resolve(MockAuthService);
  const token = authService.getToken();

  return html`
    <oryx-auth-oauth-handler providerId="${token}"></oryx-auth-oauth-handler>
  `;
};

export const Demo = Template.bind({});
