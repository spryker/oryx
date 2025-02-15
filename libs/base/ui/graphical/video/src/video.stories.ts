import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../.constants';
import { VideoAttributes } from './video.model';

export default {
  title: `${storybookPrefix}/Video`,
  args: {
    url: 'https://www.youtube.com/watch?v=m6pG6fubp9g&t=5s',
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
  parameters: {
    chromatic: { disableSnapshot: true },
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
