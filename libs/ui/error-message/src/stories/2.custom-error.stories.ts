import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';

export default {
  title: `${storybookPrefix}/form/utilities/ErrorMessage`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-error-message>
      <style>
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        oryx-icon {
          margin-inline-end: 5px;
          animation-name: spin;
          animation-duration: 3000ms;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      </style>
      <oryx-icon type="error" size="large"></oryx-icon>
      <span> Custom error content </span>
    </oryx-error-message>
  `;
};
export const CustomError = Template.bind({});
