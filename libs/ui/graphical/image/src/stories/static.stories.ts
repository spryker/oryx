import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Graphical/Image`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <section>
      <oryx-image
        src="https://d2s0ynfc62ej12.cloudfront.net/b2c/29889537_4485.jpg"
      ></oryx-image>
      <oryx-image src="not-available.jpg"></oryx-image>

      <oryx-image><svg viewBox="0 0 50 50" width="100%" height="100%"><use href="#logo" ></svg></oryx-image>
      
      
    </section>
    <style>
      section {
        display: flex;
        flex-wrap: wrap;
        gap:10px;
      }
      oryx-image {
        flex: 0 0 300px;
      }
    </style>
  `;
};
export const Static = Template.bind({});
