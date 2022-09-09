import { setupCartMocks } from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { miniCartComponent } from '../component';

useComponent(miniCartComponent);

interface Props {
  quantity: number;
}

export default {
  title: `${storybookPrefix}/Mini cart`,
  loaders: [setupCartMocks()],
} as unknown as Meta;

const Template: Story<Props> = ({ quantity }: Props): TemplateResult => {
  return html`<mini-cart .options=${{ quantity }}></mini-cart>`;
};

export const MiniCartDemo = Template.bind({});

MiniCartDemo.args = {
  quantity: 5,
};

MiniCartDemo.parameters = {
  chromatic: { disableSnapshot: true },
};
