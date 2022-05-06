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
  return sideBySide(html`
    <oryx-select>
      <select aria-label="label"></select>
    </oryx-select>
  `);
};

export const WithoutOptions = Template.bind({});

WithoutOptions.parameters = {
  chromatic: { delay: 300 },
};
