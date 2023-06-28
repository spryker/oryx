import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/text`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-content-text
      .content=${{
        text: `<h1 style="text-align:center;font-family:'M PLUS Rounded 1c'">T<u style='color:red;'>h</u>is</h1>
        <h2 style="font-family:'Grandiflora One', sans-serif;color:blue;">formatted text</h2>
        <h3>gets</h3>
        <h4 style="color:red;font-family:'Bagel Fat One';">smaller</h4>
        <h5>and</h5>
        <h6 style="text-align:end;"><s>smaller</s></h6>`,
      }}
    ></oryx-content-text>
  `;
};

export const Static = Template.bind({});
