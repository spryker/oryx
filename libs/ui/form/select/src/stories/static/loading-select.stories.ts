import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { sideBySide } from '../../../../../utilities/storybook';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`
    <oryx-select isLoading>
      <select aria-label="label"></select>
    </oryx-select>
  `);
};

export const Loading = Template.bind({});
Loading.parameters = {
  chromatic: { delay: 300 },
};
