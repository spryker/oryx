import { AppRef, ThemePlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/ui';
import { IconProperties } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';

const icons = Object.keys(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  resolve(AppRef).findPlugin(ThemePlugin)!.getIcons()
);

export default {
  title: `${storybookPrefix}/Actions/Icon Button`,
  args: {
    disabled: false,
    type: icons[0],
    size: Size.Md,
  },
  argTypes: {
    size: {
      options: [Size.Lg, Size.Md, Size.Sm],
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
  },
} as Meta;

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
      size=${ifDefined(size)}
      style=${ifDefined(color ? `color: ${color}` : undefined)}
    >
      <button ?disabled=${disabled} aria-label="story">
        <oryx-icon type=${ifDefined(type)}></oryx-icon>
      </button>
    </oryx-icon-button>
  `;
};

export const Demo = Template.bind({});
