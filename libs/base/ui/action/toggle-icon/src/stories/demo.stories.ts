import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Toggle Icon`,
  args: {
    disabled: false,
    hasError: false,
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const iconTypes = ['phone_iphone', 'tablet_mac', 'desktop_windows'];

const DemoTemplate: Story<{ disabled: boolean; hasError: boolean }> = ({
  disabled,
  hasError,
}): TemplateResult => {
  return html`
    <h3>Single select</h3>
    ${iconTypes.map(
      (iconType) => html`
        <oryx-toggle-icon ?hasError=${hasError}>
          <input
            ?disabled=${disabled}
            type="radio"
            placeholder="make a11y happy"
            value=${iconType}
            name="device-single"
          />
          <oryx-icon .type=${iconType}></oryx-icon>
        </oryx-toggle-icon>
      `
    )}

    <h3>Multi select</h3>
    ${iconTypes.map(
      (iconType) => html`
        <oryx-toggle-icon ?hasError=${hasError}>
          <input
            ?disabled=${disabled}
            type="checkbox"
            placeholder="make a11y happy"
            value=${iconType}
            name="device-multi"
          />
          <oryx-icon .type=${iconType}></oryx-icon>
        </oryx-toggle-icon>
      `
    )}
  `;
};

export const ToggleIconDemo = DemoTemplate.bind({});
