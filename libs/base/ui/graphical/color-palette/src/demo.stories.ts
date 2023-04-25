import { ColorMode, ColorTone } from '@spryker-oryx/core';
import { colorPalette } from '@spryker-oryx/themes/design-tokens';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ColorPaletteAttributes } from './color-palette.model';

export default {
  title: `${storybookPrefix}/Graphical/Color palette`,
  args: {
    mode: ColorMode.Light,
    layout: 'grid',
  },
  argTypes: {
    layout: {
      options: ['list', 'grid'],
      control: { type: 'select' },
    },
    color: {
      options: Object.keys(colorPalette),
      control: { type: 'select' },
    },
    mode: {
      options: [ColorMode.Light, ColorMode.Dark],
      control: { type: 'select' },
    },
    tone: {
      options: [
        ColorTone.Canvas,
        ColorTone.Background,
        ColorTone.BackgroundSubtle,
        ColorTone.ElementBackground,
        ColorTone.ElementHover,
        ColorTone.ElementActive,
        ColorTone.Separator,
        ColorTone.Border,
        ColorTone.BorderHover,
        ColorTone.Solid,
        ColorTone.SolidHOver,
        ColorTone.LowContrast,
        ColorTone.HighContrast,
      ],
      control: { type: 'select' },
    },
  },
} as Meta;

const Template: Story<ColorPaletteAttributes> = (
  props: ColorPaletteAttributes
): TemplateResult => {
  return html`
    <oryx-dropdown>
      <oryx-color-palette
        .color=${props.color}
        .tone=${props.tone}
        .mode=${props.mode}
        .layout=${props.layout}
      ></oryx-color-palette>
    </oryx-dropdown>

    <oryx-color-palette
      .color=${props.color}
      .tone=${props.tone}
      .mode=${props.mode}
      .layout=${props.layout}
    ></oryx-color-palette>
  `;
};

export const Demo = Template.bind({});
