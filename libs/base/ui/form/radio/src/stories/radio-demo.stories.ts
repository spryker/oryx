import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Radio`,
  args: {
    label: 'Radio label',
    subtext: 'Subtext',
    errorMessage: '',
    hasError: false,
    disabled: false,
    checked: false,
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface Props {
  label: string;
  subtext: string;
  errorMessage: string;
  hasError: boolean;
  disabled: boolean;
  checked: boolean;
}

const Template: Story<Props> = ({
  label,
  subtext,
  errorMessage,
  hasError,
  disabled,
  checked,
}: Props): TemplateResult =>
  html`
    <oryx-radio ?hasError=${hasError} errorMessage=${errorMessage}>
      <input
        name="radio"
        type="radio"
        ?disabled=${disabled}
        ?checked=${checked}
      />
      ${label}
      ${when(subtext, () => html`<small slot="subtext">${subtext}</small>`)}
    </oryx-radio>
  `;
export const RadioDemo = Template.bind({});
