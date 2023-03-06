import { IconTypes } from '@spryker-oryx/themes/icons';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../src/utilities';
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

SpinnerDemo.argTypes = {
  size: {
    options: [Size.Lg, Size.Md, Size.Sm],
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
  size: Size.Md,
  rotation: SpinnerRotation.ClockWise,
};
