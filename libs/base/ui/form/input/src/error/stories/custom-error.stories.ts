import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Props } from './model';

export default {
  title: `${storybookPrefix}/Form/Form Control/Error`,
  args: {
    value: '',
    placeholder: 'fill in...',
    disabled: false,
    readonly: false,
    label: 'Custom error content',
  },
} as Meta;

const Template: Story<Props> = ({
  value,
  placeholder,
  disabled,
  readonly,
  label,
}: Props): TemplateResult => {
  return html`
    <oryx-input .label=${label}>
      <input
        .placeholder=${placeholder}
        .value=${value}
        ?disabled=${disabled}
        ?readonly=${readonly}
      />
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
      <oryx-icon slot="error" type="error" size=${Size.Lg}></oryx-icon>
      <span slot="error"> Custom error content </span>
    </oryx-input>
  `;
};
export const CustomContent = Template.bind({});
