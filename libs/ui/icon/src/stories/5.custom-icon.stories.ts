import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import { IconProperties, Icons, IconSize as sizes } from '../icon.model';
import '../index';

interface Props {
  type: Icons | string;
  size: sizes;
  customSize: string;
}

export default { title: `${storybookPrefix}/Icon` } as Meta;

interface Props extends IconProperties {
  color: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-icon size=${props.size} style="color: ${props.color}">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" />
      </svg>
    </oryx-icon>
  `;
};

export const CustomIcon = Template.bind({});
CustomIcon.argTypes = {
  size: {
    options: ['large', 'medium', 'small'],
    control: { type: 'radio' },
  },
  color: {
    control: { type: 'color' },
  },
};
