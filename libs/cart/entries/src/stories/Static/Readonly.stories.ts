import { storybookDefaultViewports } from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Entries/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <cart-entries
      .options=${{ cartId: 'multiple', readonly: true }}
    ></cart-entries>
  `;
};

export const Readonly = Template.bind({});

Readonly.parameters = {
  chromatic: {
    delay: 3000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
