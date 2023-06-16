import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/text`,
} as Meta;

const Template: Story = (): TemplateResult => {
  const mouseenter = (e: MouseEvent) => {
    (e.target as HTMLElement).toggleAttribute('readyToExpandLines', true);
  };

  const mouseover = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.style.getPropertyValue('--max-lines')) return;
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.textContent =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    el.appendChild(tempElement);
    const pixelLineHeight = tempElement.clientHeight;
    el.removeChild(tempElement);

    el.style.setProperty(
      '--max-lines',
      (el.scrollHeight / pixelLineHeight).toString()
    );
  };
  const click = (e: MouseEvent) => {
    (e.target as HTMLElement).toggleAttribute('toggle');
  };

  return html`
    <oryx-content-text
      overflow="clamp"
      lines="2"
      @mouseover=${click}
      @mouseout=${click}
    >
      line clamp line. line clamp line line clamp line. line clamp line. line
      clamp line. line clamp line. line clamp line. line clamp line. line clamp
      line. line clamp line. line clamp line. line clamp line. line clamp line.
      line clamp line. line clamp line. line clamp line.
    </oryx-content-text>

    <oryx-content-text
      lines="2"
      overflow="clamp"
      @mouseover=${click}
      @mouseout=${click}
    >
      Clamp is 2, but we only have 1 line.<br />more<br />and more<br />and more
    </oryx-content-text>

    <oryx-content-text lines="3" overflow="fade" @click=${click}>
      Text line 1<br />
      Text line 2<br />
      Text line 3<br />
      Text line 4<br />
      Text line 5<br />
      Text line 6<br />
      Text line 7<br />
      Text line 8<br />
      Text line 9<br />
      Text line 10
    </oryx-content-text>

    <oryx-content-text lines="3" overflow="clamp" @click=${click}>
      Only 1 line
    </oryx-content-text>

    <style>
      oryx-content-text {
        outline: solid 1px red;
      }
    </style>
  `;
};

export const Static = Template.bind({});

// <!-- <oryx-content-text
// appearance="h1"
// .content=${{ text: `mimic heading` }}
// ></oryx-content-text>

// <oryx-content-text appearance="h1">
// slotted text, mimic h1
// </oryx-content-text>
// <oryx-content-text><h1>slotted element (h1)</h1></oryx-content-text>

// <oryx-content-text
// .content=${{
// text: `Text with <span style="font-family:'gill sans';font-size:40px;color:deeppink">custom</span> fonts`,
// }}
// ></oryx-content-text>

// ${[1, 2, 3, 4, 5, 6].map(
// (tag) => html` <oryx-content-text
//   .content=${{ text: `<h${tag}>heading ${tag}</h${tag}>` }}
// ></oryx-content-text>`
// )}

// <oryx-content-text
// .content=${{ text: `<b>bold text</b>` }}
// ></oryx-content-text>

// <oryx-content-text
// .content=${{ text: `<span class="caption">caption text</b>` }}
// ></oryx-content-text>

// <oryx-content-text
// .content=${{ text: `<span class="subtitle">subtitle text</b>` }}
// ></oryx-content-text>

// <oryx-content-text .content=${{ text: `just text` }}></oryx-content-text>

// <oryx-content-text
// .content=${{
// text: `Custom html<br/> with lists: <ul><li>first</li><li>second</li></ul>`,
// }}
// ></oryx-content-text>

// -->
