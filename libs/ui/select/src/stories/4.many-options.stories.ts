import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import '../index';
import { sideBySide, states } from './../../../utilities/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`
    <oryx-select>
      <select>
        ${states.map((state) => html`<option>${state}</option>`)}
      </select>
    </oryx-select>
  `);
};

export const ManyOptions = Template.bind({});
