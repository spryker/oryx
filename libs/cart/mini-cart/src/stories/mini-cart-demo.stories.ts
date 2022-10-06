import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

interface Props {
  quantity: number;
}

export default {
  title: `${storybookPrefix}/Mini cart`,
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
