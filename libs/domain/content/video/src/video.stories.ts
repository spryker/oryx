import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { ContentVideoOptions } from './video.model';

export default {
  title: `${storybookPrefix}/Video`,
  args: {
    src: 'https://d3g7htsbjjywiv.cloudfront.net/assets/common/images/media-page/redesigned-footage/footage-sizzle.webm',
  },
  argTypes: {
    src: { control: { type: 'text' } },
    autoplay: { control: { type: 'boolean' } },
    playsInline: { control: { type: 'boolean' } },
    muted: { control: { type: 'boolean' } },
    loop: { control: { type: 'boolean' } },
    controls: { control: { type: 'boolean' } },
    preload: {
      control: { type: 'select', options: ['auto', 'metadata', 'none'] },
    },
  },
} as Meta;

const Template: Story<ContentVideoOptions> = (
  options: ContentVideoOptions
): TemplateResult => {
  return html`<oryx-content-video .options=${options}></oryx-content-video> `;
};

export const Demo = Template.bind({});
