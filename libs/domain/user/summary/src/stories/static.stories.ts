import { IdentityService } from '@spryker-oryx/auth';
import { MockIdentityService } from '@spryker-oryx/auth/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

interface Props {
  behavior: 'logged' | 'not-logged';
}

export default {
  title: `${storybookPrefix}/Summary/Static`,
  argTypes: {
    behavior: {
      table: {
        disable: true,
      },
    },
  },
} as unknown as Meta;

const Template: Story<Props> = (props): TemplateResult => {
  if (props.behavior === 'logged') {
    const identityService = resolve(IdentityService) as MockIdentityService;

    identityService.set({ id: 'id', anonymous: false });
  }

  return html`<oryx-user-summary></oryx-user-summary>`;
};

export const NotLoggedIn = Template.bind({});
export const LoggedIn = Template.bind({});

NotLoggedIn.args = {
  behavior: 'not-logged',
};

LoggedIn.args = {
  behavior: 'logged',
};
