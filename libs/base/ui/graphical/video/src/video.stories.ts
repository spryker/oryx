import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../.constants';
import { VideoAttributes } from './video.model';

export default {
  title: `${storybookPrefix}/Video`,
  args: {
    url: 'https://dms.licdn.com/playlist/D4E05AQHKwD2mLTM4Og/mp4-720p-30fp-crf28/0/1677583837226?e=1678287600&v=beta&t=YCFw7j-GCjAJEh9GfrTdLloXbbYrkRkTSU866PNVFlE',
    autoplay: false,
    controls: false,
    muted: false,
    loop: false,
    playsInline: false,
  },
  argTypes: {
    url: { control: { type: 'text' } },
    preload: {
      control: { type: 'select', options: ['auto', 'metadata', 'none'] },
    },
  },
} as Meta;

const Template: Story<VideoAttributes> = (
  options: VideoAttributes
): TemplateResult => {
  return html`<oryx-video
    url=${ifDefined(options.url)}
    ?controls=${options.controls}
    ?loop=${options.loop}
    ?autoplay=${options.autoplay}
    ?playsInline=${options.playsInline}
    ?muted=${options.muted}
    .preload=${options.preload}
  ></oryx-video> `;
};

export const Demo = Template.bind({});
