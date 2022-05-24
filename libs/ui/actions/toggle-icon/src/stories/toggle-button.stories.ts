import { forceReRender, Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '..';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../utilities';

export default {
  title: `${storybookPrefix}/Actions/Toggle Button`,
  args: {
    disabled: false,
    type: 'checkbox',
    text: 'Button',
  },
  argTypes: {
    type: {
      options: ['checkbox', 'radio'],
      control: { type: 'radio' },
    },
    text: { control: { type: 'text' } },
    size: {
      options: Object.values(Size),
      control: { type: 'select' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

let checked = false;

const DemoTemplate: Story<{
  disabled: boolean;
  type: 'checkbox' | 'radio';
  text: string;
  size: Size;
}> = ({ disabled, type, text, size }): TemplateResult => {
  const onChange = (e: Event): void => {
    checked = (e.target as HTMLInputElement).checked;
    forceReRender();
  };

  return html`
    <oryx-toggle-icon size=${size}>
      <input
        ?disabled=${disabled}
        @change=${onChange}
        type=${type ?? 'checkbox'}
        placeholder="make a11y happy"
        ?checked=${checked}
      />
      <oryx-icon type="rocket"></oryx-icon>
      <span>${text}</span>
    </oryx-toggle-icon>
  `;
};

export const ToggleButtonDemo = DemoTemplate.bind({});
