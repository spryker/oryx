import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { sideBySide } from '../../../utilities/storybook';
import '../index';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`
    <oryx-select>
      <select aria-label="label"></select>
    </oryx-select>
  `);
};

export const NoOptions = Template.bind({});
