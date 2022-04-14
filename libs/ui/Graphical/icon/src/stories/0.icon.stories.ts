import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.storybook/constant';
import { IconProperties, IconTypes } from '../icon.model';
import '../index';

export default { title: `${storybookPrefix}/Graphical/Icon` } as Meta;

interface Props extends IconProperties {
  color: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-icon
      style="color: ${props.color}"
      type=${props.type}
      size=${props.size}
    ></oryx-icon>
  `;
};

export const IconDemo = Template.bind({});

IconDemo.argTypes = {
  type: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
    defaultValue: IconTypes.Add,
  },
  color: {
    control: { type: 'color' },
    defaultValue: 'black',
  },
  size: {
    options: ['large', 'medium', 'small'],
    control: { type: 'radio' },
    defaultValue: 'large',
  },
};
