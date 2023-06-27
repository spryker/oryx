import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Entries/Static`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Not limited</h3>
    <oryx-order-entries .options=${{ limit: 0 }}></oryx-order-entries>

    <h3>Limited without threshold</h3>
    <oryx-order-entries
      .options=${{ limit: 5, threshold: 0 }}
    ></oryx-order-entries>

    <h3>Limited above threshold</h3>
    <oryx-order-entries
      .options=${{ limit: 5, threshold: 2 }}
    ></oryx-order-entries>

    <h3>Limited under threshold</h3>
    <oryx-order-entries
      .options=${{ limit: 5, threshold: 5 }}
    ></oryx-order-entries>
  `;
};

export const Variants = Template.bind({});
