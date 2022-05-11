import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';
import { RatingProperties } from '../../index';

export default { title: `${storybookPrefix}/Graphical/Rating/Static` } as Meta;

const Template: Story<RatingProperties> = (): TemplateResult => {
  return html`
    ${[0, 1, 2, 3, 4, 5].map(
      (scale) => html`
        <oryx-rating value=${scale}>
          ${[1, 2, 3, 4, 5].map(
            (scale) =>
              html`<oryx-icon type="ratings" slot=${scale}></oryx-icon>`
          )}
        </oryx-rating>
      `
    )}
  `;
};

export const RateBySVG = Template.bind({});
