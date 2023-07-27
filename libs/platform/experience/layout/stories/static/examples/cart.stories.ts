import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { generateLayoutItems } from '../util';
import { generateHeader, pageStyles } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static/Examples`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Cart Page</h1>

    <oryx-layout class="page" .options=${{ rules: [{ padding: '30px 0' }] }}>
      ${generateHeader()}

      <oryx-layout
        layout="split-column"
        .options=${{ rules: [{ top: 90, splitColumnFactor: 2 / 3 }] }}
      >
        <oryx-layout layout="list">
          ${generateLayoutItems(20, 1, 'Cart item')}
        </oryx-layout>

        <oryx-layout
          layout="list"
          layout-sticky
          .options=${{ rules: [{ top: 90 }] }}
        >
          <oryx-layout layout="list">
            <div>subtotal</div>
            <div>discounts</div>
            <div>tax</div>
            <div>total</div>
          </oryx-layout>
          <div>Checkout</div>
        </oryx-layout>
      </oryx-layout>

      <h3>recommendations (carousel)</h3>
      <oryx-layout layout="carousel"> ${generateLayoutItems(12)} </oryx-layout>
    </oryx-layout>

    ${pageStyles}
  `;
};

export const CartPage = Template.bind({});
