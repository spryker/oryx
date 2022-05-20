import { forceReRender, Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '..';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/actions/Toggle Icon`,
  args: {
    disabled: false,
    type: 'checkbox',
  },
  argTypes: {
    type: {
      options: ['checkbox', 'radio'],
      control: { type: 'radio' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

let checked = false;

const DemoTemplate: Story<{
  disabled: boolean;
  type: 'checkbox' | 'radio';
}> = ({ disabled, type }): TemplateResult => {
  const onChange = (e: Event): void => {
    checked = (e.target as HTMLInputElement).checked;
    forceReRender();
  };

  return html`
    <oryx-toggle-icon>
      <input
        ?disabled=${disabled}
        @change=${onChange}
        type=${type ?? 'checkbox'}
        placeholder="make a11y happy"
        ?checked=${checked}
      />
      <oryx-icon type="rocket"></oryx-icon>
    </oryx-toggle-icon>
  `;
};

export const ToggleIconDemo = DemoTemplate.bind({});
