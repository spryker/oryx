import { getAppGraphics } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Graphical/Image`,
} as Meta;

const resources = getAppGraphics();

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Resources</h3>
    <oryx-layout .layout=${'grid'}>
      ${resources.map(
        (resource) => html`<oryx-image .resource=${resource}></oryx-image>`
      )}
    </oryx-layout>

    <h3>Resources (fill color override)</h3>
    <oryx-layout
      .layout=${'grid'}
      style="--oryx-fill:var(--oryx-color-neutral-12)"
    >
      ${resources.map(
        (resource) => html`<oryx-image .resource=${resource}></oryx-image>`
      )}
    </oryx-layout>

    <h3>Src</h3>
    <oryx-layout .layout=${'grid'}>
      <oryx-image
        .src=${`data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 76.9 116.5' style='enable-background:new 0 0 76.9 116.5;' xml:space='preserve'%3E%3Cstyle%3E path %7B fill: black; %7D @media (prefers-color-scheme: dark) %7B path %7B fill: white; %7D %7D %3C/style%3E%3Cg id='logo'%3E%3Cpath d='M42.6,107.4l-0.9,0.6c-0.3,0.2-0.6,0.4-0.9,0.7c-0.3,0.2-0.5,0.5-0.6,0.8c-0.2,0.3-0.2,0.6-0.1,0.9v0.2l0.1,0.2 c0,0.1,0,0.1,0.1,0.2s0,0.1,0.1,0.2l-0.6,0.9c-0.1,0.3-0.3,0.5-0.5,0.8c-0.2,0.2-0.4,0.4-0.7,0.6c-0.3,0.1-0.7,0.2-1,0.2 c-0.4,0-0.8-0.1-1.2-0.2c-0.4-0.1-0.8-0.3-1.1-0.5c-0.4-0.2-0.7-0.4-1-0.7c-0.4-0.2-0.7-0.5-1-0.8v-0.4c-0.1-0.3-0.2-0.6-0.4-0.8 c-0.2-0.2-0.4-0.5-0.6-0.7s-0.5-0.4-0.7-0.6c-0.3-0.2-0.5-0.4-0.8-0.5v0.7c0.3,0.8,0.6,1.5,1.1,2.2c0.5,0.6,1,1.2,1.6,1.8 c0.6,0.5,1.3,0.9,2,1.2c0.7,0.3,1.4,0.5,2.2,0.5c0.8,0,1.5-0.1,2.2-0.4c0.7-0.3,1.3-0.7,1.7-1.3c0.5-0.6,0.9-1.3,1.1-2.1 c0.2-0.9,0.2-1.9,0-2.8L42.6,107.4z'/%3E%3Cpath d='M12.1,69.2l-0.2,0.1l-0.2,0.1l-0.2,0.1l-0.2,0.2l-1.2,0.9c-0.4,0.3-0.8,0.6-1.1,1c-0.3,0.4-0.6,0.8-0.9,1.2 c-0.3,0.5-0.6,1-0.8,1.6c0.7-0.1,1.5-0.1,2.2,0c0.8,0.1,1.6,0.3,2.3,0.6c0.8,0.3,1.6,0.7,2.3,1.2c0.8,0.6,1.6,1.2,2.3,1.8l-3.1-9.2 H13l-0.3,0.1L12.4,69L12.1,69.2'/%3E%3Cpath d='M14.7,68.7l3.1,9l6.8,0.1c-0.7-1.3-1.4-2.6-2.3-3.8c-0.7-1.1-1.6-2-2.5-2.9c-0.8-0.7-1.7-1.3-2.6-1.8 C16.4,69,15.6,68.8,14.7,68.7' /%3E%3Cpath d='M18.7,80.5c1.1,1.3,2.2,2.7,3.1,4.2c1.1,1.7,2,3.5,2.9,5.3c0.9,1.9,1.8,4,2.6,6.2s1.6,4.6,2.3,7.1c0-1.1,0.1-2.2,0-3.3 s-0.1-2.3-0.2-3.5s-0.2-2.4-0.4-3.6l-0.6-3.6c-0.2-0.8-0.4-1.6-0.5-2.3c-0.2-0.7-0.4-1.5-0.6-2.2c-0.2-0.7-0.4-1.4-0.7-2.1 c-0.3-0.7-0.5-1.3-0.7-2L18.7,80.5z' /%3E%3Cpath d='M3.3,14.4C3.5,16.2,3.7,18.1,4,20s0.5,3.8,0.8,5.8c0.3,2,0.6,3.9,0.9,5.9s0.7,4,1.1,6c0.5,2.6,1,5.2,1.6,7.7 c0.6,2.5,1.2,5,1.8,7.4s1.3,4.7,1.9,7s1.4,4.5,2.1,6.6c0.3,0,0.6-0.1,0.9-0.1c0.3,0,0.6,0,0.9,0.1c0.3,0.1,0.6,0.1,0.9,0.2 c0.3,0.1,0.6,0.2,0.9,0.4c-0.7-1.7-1.4-3.4-2.1-5.2c-0.7-1.8-1.4-3.6-2-5.5s-1.3-3.8-1.9-5.7s-1.2-3.9-1.8-5.9 c-0.8-2.6-1.5-5.2-2.2-7.8S6.5,31.7,6,29.2s-1.1-5-1.5-7.4S3.7,16.8,3.3,14.4'/%3E%3Cpath d='M63.9,52.8c-0.4,0.1-0.8,0.1-1.2,0.2l-1.2,0.3l-1.2,0.3L59.1,54l-1.2,11.4c1.3-1.4,2.6-2.8,4-4.1c1.4-1.2,2.8-2.4,4.3-3.4 c1.4-1,2.9-2,4.5-2.8c1.5-0.8,3-1.5,4.6-2.2c-0.9-0.3-1.8-0.5-2.7-0.6c-0.9-0.1-1.7-0.2-2.6-0.2c-0.9,0-1.8,0.1-2.8,0.2 c-1,0.1-2,0.3-3.1,0.4C64.1,52.7,63.9,52.8,63.9,52.8z'/%3E%3Cpath d='M54.2,70.1l-16.5,8.2c-0.2,0.9-0.4,1.9-0.5,2.8c-0.1,1-0.3,1.9-0.3,2.8c-0.1,1-0.1,1.9-0.1,2.9c0,1,0.1,2,0.2,3 c0.1,1.4,0.4,2.9,0.7,4.3c0.3,1.4,0.8,2.7,1.3,4c1,2.5,2.4,4.9,4.1,7.1c0.1-3.4,0.4-6.8,1-10.1c0.6-3.2,1.4-6.3,2.4-9.3 c1-2.9,2.1-5.7,3.5-8.4C51.1,74.9,52.5,72.4,54.2,70.1'/%3E%3Cpath d='M49.2,1.1c0.6,2.1,1,4.2,1.3,6.4c0.4,2.2,0.6,4.6,0.8,7s0.3,5,0.5,7.6s0.2,5.4,0.2,8.2c0.2,5.5-0.2,10.9-1.2,16.3 c-0.7,3.9-1.9,7.6-3.6,11.2c-1.3,2.7-2.8,5.4-4.4,8c-1.5,2.3-2.6,4.7-3.5,7.3l-0.1,0.2l-0.1,0.2c0,0.1,0,0.1-0.1,0.2 s-0.1,0.1-0.1,0.2l15.6-7.5l0,0c0.8-5,1.3-9.7,1.6-14.1s0.3-8.2,0.3-12c0-3.4-0.2-6.7-0.6-10.1c-0.3-3.1-0.7-5.9-1.1-8.4 c-0.3-1.9-0.7-3.8-1.1-5.6s-0.8-3.6-1.3-5.3s-1-3.4-1.5-5S49.8,2.6,49.2,1.1' opacity='0.7'/%3E%3C/g%3E%3C/svg%3E%0A`}
      ></oryx-image>
      <oryx-image
        src="https://d2s0ynfc62ej12.cloudfront.net/b2c/29889537_4485.jpg"
      ></oryx-image>
    </oryx-layout>

    <h3>Fallback</h3>
    <oryx-layout .layout=${'grid'}>
      <oryx-image resource="unknown"></oryx-image>
      <oryx-image resource="unknown" skipFallback></oryx-image>
    </oryx-layout>
    <style>
      oryx-layout {
        --oryx-column-count: 6;
        --column-gap: 100px;
        --row-gap: 50px;
        padding: 50px;
      }
      oryx-image {
        aspect-ratio: 2/1;
        display: block;
      }
    </style>
  `;
};
export const Static = Template.bind({});
