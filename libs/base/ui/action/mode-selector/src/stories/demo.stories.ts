import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Mode Selector`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-mode-selector
      @oryx.toggle-mode=${(e: Event) => console.log(`Toggle Mode Event ${e}`)}
    ></oryx-mode-selector>
  `;
};

export const Demo = Template.bind({});
