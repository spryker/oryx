import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Utilities/ErrorMessage`,
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
          animation-duration: 1200ms;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      </style>
      <oryx-icon .type=${IconTypes.Error} size=${Size.Lg}></oryx-icon>
      <span> Custom error content </span>
    </oryx-error-message>
  `;
};
export const CustomError = Template.bind({});
