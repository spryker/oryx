import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { radioComponent } from '../index';

useComponent(radioComponent);

export default { title: `${storybookPrefix}/Form/Radio` } as Meta;

interface Props {
  disabled: boolean;
}

const Template: Story<Props> = ({ disabled }: Props): TemplateResult =>
  html`
    <div class="wrapper">
      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        Radio label
      </oryx-radio>

      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        Radio label with a lot of text will be displayed over multiple lines.
        Radio label with a lot of text will be displayed over multiple lines.
      </oryx-radio>

      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        <span>
          Radio label with a lot of text wrapped in an element, will be
          truncated. Radio label with a lot of text wrapped in an element, will
          be truncated.
        </span>
      </oryx-radio>

      <oryx-radio>
        <input name="radio" type="radio" ?disabled=${disabled} />
        Radio label
      </oryx-radio>
    </div>
    <style>
      .wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    </style>
  `;
export const RadioDemo = Template.bind({});
RadioDemo.args = {
  disabled: false,
};
