import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Entries/Static`,
};

const renderOrderEntries = (options): TemplateResult => {
  return html`<oryx-order-entries
    orderId="mockid"
    .options=${options}
  ></oryx-order-entries>`;
};

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Not limited</h3>
    ${renderOrderEntries({ limit: 0 })}

    <h3>Limited without threshold</h3>
    ${renderOrderEntries({ limit: 5, threshold: 0 })}

    <h3>Limited above threshold</h3>
    ${renderOrderEntries({ limit: 5, threshold: 2 })}

    <h3>Limited under threshold</h3>
    ${renderOrderEntries({ limit: 5, threshold: 5 })}
  `;
};

export const Variants = Template.bind({});
