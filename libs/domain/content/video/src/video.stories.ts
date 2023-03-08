import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { ContentVideoOptions } from './video.model';

export default {
  title: `${storybookPrefix}/Video`,
  args: {
    src: 'https://dms.licdn.com/playlist/D4E05AQHKwD2mLTM4Og/mp4-720p-30fp-crf28/0/1677583837226?e=1678287600&v=beta&t=YCFw7j-GCjAJEh9GfrTdLloXbbYrkRkTSU866PNVFlE',
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
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const Template: Story<ContentVideoOptions> = (
  options: ContentVideoOptions
): TemplateResult => {
  return html`<oryx-content-video .options=${options}></oryx-content-video> `;
};

export const Demo = Template.bind({});
