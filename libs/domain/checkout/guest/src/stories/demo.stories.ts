import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

interface Props {
  url: string;
}

export default {
  title: `${storybookPrefix}/Guest`,
  argTypes: {
    url: { control: { type: 'text' } },
  },
} as unknown as Meta;

const Template: Story<Props> = ({ url }: Props): TemplateResult => {
  return html`<checkout-guest .options=${{ url }}></checkout-guest>`;
};

export const GuestDemo = Template.bind({});
