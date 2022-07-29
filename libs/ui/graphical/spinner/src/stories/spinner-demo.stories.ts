import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { IconTypes } from '../../../../graphical/icon';
import { Size } from '../../../../utilities';
import '../index';
import { SpinnerProperties, SpinnerRotation } from '../spinner.model';

export default { title: `${storybookPrefix}/Graphical/Spinner` } as Meta;

interface Props extends SpinnerProperties {
  color: string;
}

const Template: Story<Props> = ({
  icon,
  rotation,
  size,
  color,
}: Props): TemplateResult => {
  return html`
    <oryx-spinner
      style="color: ${color};"
      icon=${icon}
      size=${size}
      rotation=${rotation}
    ></oryx-spinner>
  `;
};

export const SpinnerDemo = Template.bind({});
SpinnerDemo.parameters = {
  chromatic: { delay: 300 },
};

SpinnerDemo.argTypes = {
  size: {
    options: Object.values(Size),
    control: { type: 'select' },
  },
  icon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  rotation: {
    options: Object.values(SpinnerRotation),
    control: { type: 'select' },
  },
  color: {
    control: { type: 'color' },
  },
};

SpinnerDemo.args = {
  color: 'green',
  icon: IconTypes.Loader,
  size: Size.medium,
  rotation: SpinnerRotation.ClockWise,
};
