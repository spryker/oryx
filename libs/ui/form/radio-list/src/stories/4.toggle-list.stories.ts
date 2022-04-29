import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.storybook/constant';
import '../index';

export default { title: `${storybookPrefix}/Form/Radio List/Static` } as Meta;

const Template: Story = (): TemplateResult =>
  html`
    <oryx-radio-list heading="Title" direction="vertical">
      <oryx-toggle>
        <input name="radio" type="radio" />
        Option
      </oryx-toggle>

      <oryx-toggle>
        <input name="radio" type="radio" />
        Option
      </oryx-toggle>

      <oryx-toggle>
        <input name="radio" type="radio" />
        Option
      </oryx-toggle>

      <oryx-toggle>
        <input name="radio" type="radio" />
        Option
      </oryx-toggle>
    </oryx-radio-list>
  `;
export const Toggle = Template.bind({});
