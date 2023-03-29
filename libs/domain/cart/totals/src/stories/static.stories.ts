import { cartTotalsStaticData } from '@spryker-oryx/cart/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <section>
      ${cartTotalsStaticData.map(
        (mock) => html` <oryx-cart-totals .uid=${mock.id}></oryx-cart-totals>`
      )}
    </section>
    <style>
      section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
    </style>
  `;
};

export const Variation = Template.bind({});
