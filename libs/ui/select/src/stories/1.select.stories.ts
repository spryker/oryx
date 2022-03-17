import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { sideBySide } from '../../../utilities/storybook';
import '../index';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const selectOptions = ['Red', 'Green', 'Blue'];

  return sideBySide(html`
    <oryx-select label="select">
      <select>
        ${selectOptions.map((state) => html`<option>${state}</option>`)}
      </select>
    </oryx-select>
  `);
};

export const StandardSelect = Template.bind({});
