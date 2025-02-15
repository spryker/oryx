import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { RatingProperties } from '../../index';

export default { title: `${storybookPrefix}/Graphical/Rating/Static` } as Meta;

const Template: Story<RatingProperties> = (): TemplateResult => {
  const heart = html`<svg viewBox="0 0 128 128">
    <path
      d="M90.35,16.05c-11.66,0-21.81,6.97-26.35,17.06c-4.54-10.08-14.69-17.06-26.35-17.06 c-15.92,0-28.87,12.96-28.87,28.88c0,35.9,51.79,65.46,54,66.7c0.38,0.21,0.79,0.32,1.21,0.32c0.42,0,0.84-0.11,1.21-0.32 c2.2-1.24,54.01-30.8,54.01-66.7C119.22,29.01,106.27,16.05,90.35,16.05z"
    />
  </svg>`;
  const scales = [1, 2, 3, 4, 5];

  return html`
    <oryx-rating>
      ${scales.map((i) => html`<oryx-icon slot=${i}> ${heart}</oryx-icon>`)}
    </oryx-rating>
    ${scales.map(
      (scale) => html`<oryx-rating value=${scale}>
        ${scales.map((i) => html`<oryx-icon slot=${i}> ${heart}</oryx-icon>`)}
      </oryx-rating>`
    )}

    <style>
      oryx-icon {
        --oryx-rating-color-active: #e75480;
      }
      oryx-icon:nth-child(1) {
        --oryx-rating-color-inactive: rgba(249, 213, 229, 0.3);
        --oryx-rating-color-hover: rgba(249, 213, 229, 0.8);
      }
      oryx-icon:nth-child(2) {
        --oryx-rating-color-inactive: rgba(238, 172, 153, 0.3);
        --oryx-rating-color-hover: rgba(238, 172, 153, 0.8);
      }
      oryx-icon:nth-child(3) {
        --oryx-rating-color-inactive: rgba(224, 99, 119, 0.3);
        --oryx-rating-color-hover: rgba(224, 99, 119, 0.8);
      }
      oryx-icon:nth-child(4) {
        --oryx-rating-color-inactive: rgba(200, 51, 73, 0.3);
        --oryx-rating-color-hover: rgba(200, 51, 73, 0.8);
      }
      oryx-icon:nth-child(5) {
        --oryx-rating-color-inactive: rgba(102, 51, 153, 0.3);
        --oryx-rating-color-hover: rgba(102, 51, 153, 083);
      }
    </style>
  `;
};

export const Colorful = Template.bind({});
