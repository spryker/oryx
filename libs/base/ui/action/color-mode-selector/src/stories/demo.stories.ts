import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Color Mode Selector`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-color-mode-selector
      @oryx.toggle-mode=${(e: Event) => console.log(`Toggle Mode Event ${e}`)}
    ></oryx-color-mode-selector>
  `;
};

export const Demo = Template.bind({});
