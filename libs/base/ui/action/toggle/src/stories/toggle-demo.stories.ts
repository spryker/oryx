import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Toggle`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface Props {
  type: string;
  firstToggleText: string;
  secondToggleText: string;
  firstToggleDisabled?: boolean;
  secondToggleDisabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-toggle ?hasError=${props.hasError} errorMessage=${props.errorMessage}>
      <input
        name="test-group"
        value="one"
        type=${props.type || 'checkbox'}
        ?disabled=${props.firstToggleDisabled}
        aria-label="male a11y happy"
      />
      ${props.firstToggleText}
    </oryx-toggle>
    <oryx-toggle ?hasError=${props.hasError} errorMessage=${props.errorMessage}>
      <input
        name="test-group"
        value="two"
        type=${props.type || 'checkbox'}
        ?disabled=${props.secondToggleDisabled}
        aria-label="male a11y happy"
      />
      ${props.secondToggleText}
    </oryx-toggle>

    <style>
      oryx-toggle {
        margin-bottom: 10px;
      }
    </style>
  `;
};

export const ToggleDemo = Template.bind({});

ToggleDemo.args = {
  type: 'checkbox',
  firstToggleText: 'First toggle',
  secondToggleText: 'Second toggle',
  firstToggleDisabled: false,
  secondToggleDisabled: false,
  hasError: false,
  errorMessage: '',
};

ToggleDemo.argTypes = {
  type: {
    options: ['checkbox', 'radio'],
    control: { type: 'select' },
  },
};
