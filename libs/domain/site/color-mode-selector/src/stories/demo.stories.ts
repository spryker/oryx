import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../domain/site/.constants';

export default {
  title: `${storybookPrefix}/Mode Selector`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-site-mode-selector
      @oryx.toggle-mode=${(e: Event) => console.log(`Toggle Mode Event ${e}`)}
    ></oryx-site-mode-selector>
  `;
};

export const Demo = Template.bind({});
