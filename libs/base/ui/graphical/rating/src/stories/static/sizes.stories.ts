import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Rating/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-rating readonly value="4.3">readonly, large</oryx-rating>
    <oryx-rating readonly value="4.3" size=${Size.Sm}
      >readonly, small</oryx-rating
    >

    <oryx-rating value="4.3" characters="😡😔😐😀🤩">emojis, large</oryx-rating>
    <oryx-rating value="4.3" characters="😡😔😐😀🤩" size=${Size.Sm}
      >emojis, small</oryx-rating
    >

    <oryx-rating value="4.3" characters="✪✪✪✪✪">unicode, large</oryx-rating>
    <oryx-rating value="4.3" characters="✪✪✪✪✪" size=${Size.Sm}
      >unicode, small</oryx-rating
    >

    <oryx-rating value="4.3">
      ${[1, 2, 3, 4, 5].map(
        (scale) =>
          html`<oryx-icon .type=${IconTypes.Ratings} slot=${scale}></oryx-icon>`
      )}
    </oryx-rating>

    <oryx-rating value="4.3" size=${Size.Sm}>
      ${[1, 2, 3, 4, 5].map(
        (scale) =>
          html`<oryx-icon .type=${IconTypes.Ratings} slot=${scale}></oryx-icon>`
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
