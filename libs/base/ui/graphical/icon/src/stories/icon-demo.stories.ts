import { AppRef, ThemePlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../src/utilities';
import { IconProperties } from '../icon.model';

export default { title: `${storybookPrefix}/Graphical/Icon` } as Meta;

const icons = Object.keys(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  resolve(AppRef).findPlugin(ThemePlugin)!.getIcons()
);

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
  type: icons[0],
  color: 'black',
  size: Size.Lg,
};

IconDemo.argTypes = {
  type: {
    options: Object.values(icons),
    control: { type: 'select' },
  },
  color: {
    control: { type: 'color' },
  },
  size: {
    options: [Size.Lg, Size.Md, Size.Sm],
    control: { type: 'radio' },
  },
};
