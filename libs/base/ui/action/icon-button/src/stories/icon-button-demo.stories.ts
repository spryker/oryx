import { AppRef, ThemePlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { IconProperties } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../src/utilities';

export default { title: `${storybookPrefix}/Actions/Icon Button` } as Meta;

const icons = Object.keys(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  resolve(AppRef).findPlugin(ThemePlugin)!.getIcons()
);

interface Props extends IconProperties {
  color: string;
  disabled: boolean;
}

const Template: Story<Props> = ({
  size,
  disabled,
  type,
  color,
}: Props): TemplateResult => {
  return html`
    <oryx-icon-button
      size=${size}
      style=${color ? `color: ${color}` : undefined}
    >
      <button ?disabled=${disabled} aria-label="story">
        <oryx-icon type=${type}></oryx-icon>
      </button>
    </oryx-icon-button>
  `;
};

export const IconButtonDemo = Template.bind({});

IconButtonDemo.argTypes = {
  size: {
    options: [Size.Large, Size.Medium, Size.Small],
    control: { type: 'select' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  type: {
    options: Object.values(icons),
    control: { type: 'select' },
  },
  color: {
    control: { type: 'color' },
  },
};

IconButtonDemo.args = {
  disabled: false,
  type: icons[0],
  size: Size.Medium,
};
