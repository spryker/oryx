import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Entries/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h3>Single entry</h3>
    <oryx-cart-entries></oryx-cart-entries>

    <h3>Empty cart</h3>
    <oryx-cart-entries cartId="empty"></oryx-cart-entries>

    <h3>Multiple entries</h3>
    <oryx-cart-entries cartId="multiple"></oryx-cart-entries>

    <h3>Readonly</h3>
    <oryx-cart-entries
      cartId="multiple"
      .options=${{ readonly: true }}
    ></oryx-cart-entries>

    <h3>Collapsible</h3>
    <oryx-cart-entries
      cartId="multiple"
      .options=${{ collapsible: true }}
    ></oryx-cart-entries>

    <h3>Expanded with single entry</h3>
    <oryx-cart-entries
      .options=${{ collapsible: true, expanded: true }}
    ></oryx-cart-entries>

    <h3>Expanded with multiple entries</h3>
    <oryx-cart-entries
      cartId="multiple"
      .options=${{ collapsible: true, expanded: true }}
    ></oryx-cart-entries>

    <h3>Expanded with readonly</h3>
    <oryx-cart-entries
      cartId="multiple"
      .options=${{
        collapsible: true,
        readonly: true,
        expanded: true,
      }}
    ></oryx-cart-entries>

    <h3>Hide items count</h3>
    <oryx-cart-entries
      .options=${{ collapsible: true, hideItemsCount: true }}
    ></oryx-cart-entries>
  `;
};

export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 5000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
