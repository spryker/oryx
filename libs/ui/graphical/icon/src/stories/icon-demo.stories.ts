import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../utilities';
import { IconProperties, IconTypes } from '../icon.model';

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

IconDemo.args = {
  type: IconTypes.Add,
  color: 'black',
  size: Size.large,
};

IconDemo.argTypes = {
  type: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  color: {
    control: { type: 'color' },
  },
  size: {
    options: Object.values(Size),
    control: { type: 'radio' },
  },
};
