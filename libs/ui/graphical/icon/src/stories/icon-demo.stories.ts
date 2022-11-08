import { AppRef, ThemePlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../utilities';
import { IconProperties } from '../icon.model';

export default { title: `${storybookPrefix}/Graphical/Icon` } as Meta;

const icons = Object.keys(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  resolve(AppRef).findPlugin(ThemePlugin)!.getIconsList()
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
  size: Size.large,
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
    options: Object.values(Size),
    control: { type: 'radio' },
  },
};
