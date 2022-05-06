import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../../../../option/src';
import { sideBySide } from '../../../../../utilities/storybook';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const selectOptions = ['Red', 'Green', 'Blue'];

  return sideBySide(html`
    <oryx-select label="select" ?emptyOption=${true}>
      <select>
        ${selectOptions.map(
          (value) =>
            html`<option ?selected=${value === 'Green'}>${value}</option>`
        )}
      </select>
    </oryx-select>
  `);
};

export const Selected = Template.bind({});
