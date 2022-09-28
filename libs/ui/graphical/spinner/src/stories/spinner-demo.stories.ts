import { useComponent } from '@spryker-oryx/core/utilities';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import { css, TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../utilities';
import { spinnerComponent } from '../component';
import { SpinnerProperties, SpinnerRotation } from '../spinner.model';

useComponent(
  spinnerComponent(
    isChromatic()
      ? {
          theme: {
            // TODO: fix it with just css after theme refactoring
            styles: [
              css`
                oryx-icon,
                ::slotted(oryx-icon) {
                  animation-iteration-count: 0;
                }
              `,
            ],
          },
        }
      : {}
  )
);

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
