import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { setupCartMocks } from '../../../src/mocks/cart.mock';
import '../index';

interface Props {
  quantity: number;
}

export default {
  title: `${storybookPrefix}/Mini cart`,
  loaders: [setupCartMocks],
} as unknown as Meta;

const Template: Story<Props> = ({ quantity }: Props): TemplateResult => {
  return html`<mini-cart .options=${{ quantity }}></mini-cart>`;
};

export const MiniCartDemo = Template.bind({});

MiniCartDemo.args = {
  quantity: 5,
};
