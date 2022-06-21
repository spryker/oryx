import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '..';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../utilities';

export default {
  title: `${storybookPrefix}/Actions/Toggle Button`,
  args: {
    disabled: false,
  },
  argTypes: {
    text: { control: { type: 'text' } },
    size: {
      options: Object.values(Size),
      control: { type: 'select' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const iconTypes = ['mobile', 'tablet', 'desktop'];

const DemoTemplate: Story<{
  disabled: boolean;
  text: string;
  size: Size;
}> = ({ disabled, text, size }): TemplateResult => {
  return html`
    <h3>Single select</h3>
    ${iconTypes.map(
      (iconType) => html`
        <oryx-toggle-icon size=${size}>
          <input
            ?disabled=${disabled}
            type="radio"
            placeholder="make a11y happy"
            value=${iconType}
            name="device-single"
          />
          <oryx-icon type="${iconType}"></oryx-icon>
          <span>${text ?? iconType}</span>
        </oryx-toggle-icon>
      `
    )}

    <h3>Multi select</h3>
    ${iconTypes.map(
      (iconType) => html`
        <oryx-toggle-icon size=${size}>
          <input
            ?disabled=${disabled}
            type="checkbox"
            placeholder="make a11y happy"
            value=${iconType}
            name="device-multi"
          />
          <oryx-icon type="${iconType}"></oryx-icon>
          <span>${text ?? iconType}</span>
        </oryx-toggle-icon>
      `
    )}
  `;
};

export const ToggleButtonDemo = DemoTemplate.bind({});
