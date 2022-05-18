import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Direction } from '../../../../utilities';
import '../index';

export default { title: `${storybookPrefix}/Form/Radio List` } as Meta;

interface Props {
  disabled: boolean;
  direction: Direction;
  heading: string;
  errorMessage?: string;
  hasError?: boolean;
}

const Template: Story<Props> = ({
  disabled,
  direction,
  heading,
  errorMessage,
  hasError,
}: Props): TemplateResult =>
  html`
    <oryx-radio-list
      .heading=${heading}
      .direction=${direction}
      .hasError=${hasError}
      .errorMessage=${errorMessage}
    >
      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        Option
      </oryx-radio>

      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        Option
      </oryx-radio>

      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        Option
      </oryx-radio>

      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        Option
      </oryx-radio>
    </oryx-radio-list>
  `;
export const RadioListDemo = Template.bind({});
RadioListDemo.args = {
  disabled: false,
  direction: Direction.vertical,
  heading: 'Title',
  hasError: false,
};
RadioListDemo.argTypes = {
  direction: {
    control: { type: 'select' },
    options: Object.values(Direction),
  },
  heading: {
    control: { type: 'text' },
  },
  errorMessage: {
    control: { type: 'text' },
  },
  hasError: {
    control: { type: 'boolean' },
  },
};
