import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';

export default { title: `${storybookPrefix}/Graphical/Rating/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-rating readonly value="4.3">readonly, large</oryx-rating>
    <oryx-rating readonly value="4.3" size="small">readonly, small</oryx-rating>

    <oryx-rating value="4.3" characters="😡😔😐😀🤩">emojis, large</oryx-rating>
    <oryx-rating value="4.3" characters="😡😔😐😀🤩" size="small"
      >emojis, small</oryx-rating
    >

    <oryx-rating value="4.3" characters="✪✪✪✪✪">unicode, large</oryx-rating>
    <oryx-rating value="4.3" characters="✪✪✪✪✪" size="small"
      >unicode, small</oryx-rating
    >

    <oryx-rating value="4.3">
      ${[1, 2, 3, 4, 5].map(
        (scale) => html`<oryx-icon type="ratings" slot=${scale}></oryx-icon>`
      )}
    </oryx-rating>

    <oryx-rating value="4.3" size="small">
      ${[1, 2, 3, 4, 5].map(
        (scale) => html`<oryx-icon type="ratings" slot=${scale}></oryx-icon>`
      )}
    </oryx-rating>

    <style>
      oryx-rating {
        margin-bottom: 6px;
      }

      oryx-rating:nth-child(even) {
        margin-bottom: 24px;
      }
    </style>
  `;
};

export const Sizes = Template.bind({});
