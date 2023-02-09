import { storybookDefaultViewports } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Entries/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h3>Single entry</h3>
    <cart-entries></cart-entries>

    <h3>Empty cart</h3>
    <cart-entries .options=${{ cartId: 'empty' }}></cart-entries>

    <h3>Multiple entries</h3>
    <cart-entries .options=${{ cartId: 'multiple' }}></cart-entries>

    <h3>Readonly</h3>
    <cart-entries
      .options=${{ cartId: 'multiple', readonly: true }}
    ></cart-entries>

    <h3>Collapsible</h3>
    <cart-entries .options=${{ collapsible: true }}></cart-entries>

    <h3>Expanded with single entry</h3>
    <cart-entries
      .options=${{ collapsible: true, expanded: true }}
    ></cart-entries>

    <h3>Expanded with multiple entries</h3>
    <cart-entries
      .options=${{ cartId: 'multiple', collapsible: true, expanded: true }}
    ></cart-entries>

    <h3>Expanded with readonly</h3>
    <cart-entries
      .options=${{
        cartId: 'multiple',
        collapsible: true,
        readonly: true,
        expanded: true,
      }}
    ></cart-entries>

    <h3>Hide items count</h3>
    <cart-entries
      .options=${{ collapsible: true, hideItemsCount: true }}
    ></cart-entries>
  `;
};

export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 3000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
