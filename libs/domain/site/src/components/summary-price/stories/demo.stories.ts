import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Summary Price`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-site-summary-price
    label="label"
    subtext="Sub text"
    .value=${100}
    .currency=${'EUR'}
    .prices=${[
      { label: 'test 1', value: 1000 },
      { label: 'test 2', value: 1320 },
    ]}
  ></oryx-site-summary-price>`;
};

export const Demo = Template.bind({});
