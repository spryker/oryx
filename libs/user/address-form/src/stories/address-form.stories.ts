import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Address Form`,
} as unknown as Meta;

interface Props {
  country: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<oryx-address-form
    .country=${props.country}
  ></oryx-address-form>`;
};

export const Demo = Template.bind({});

Demo.args = {
  country: 'DE',
};

Demo.argTypes = {
  country: {
    control: { type: 'select' },
    options: ['DE', 'US'],
  },
};
