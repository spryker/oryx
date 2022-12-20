import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { renderSelector } from '../helper';

export default {
  title: `${storybookPrefix}/Address List Item/Static`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h4>Selectable</h4>
    ${renderSelector({ selectable: true })}

    <h4>With controls</h4>
    ${renderSelector({ editable: true, removable: true })}

    <h4>Single default</h4>
    ${renderSelector({ defaultShipping: true })}

    <h4>With defaults</h4>
    ${renderSelector({ defaultShipping: true, defaultBilling: true })}
  `;
};

export const Variants = Template.bind({});
