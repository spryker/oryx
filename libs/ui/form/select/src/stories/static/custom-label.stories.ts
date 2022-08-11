import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { sideBySide } from '../../../../../utilities/storybook';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const selectOptions = ['Red', 'Green', 'Blue'];

  return sideBySide(html`
    <oryx-select ?allowEmptyValue=${true} has-label>
      <span slot="label">custom label requires has-label on the host</span>
      <select>
        ${selectOptions.map((state) => html`<option>${state}</option>`)}
      </select>
    </oryx-select>
  `);
};

export const CustomLabel = Template.bind({});
