import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Actions/Toggle/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-toggle style="width: 200px">
      <input type="checkbox" aria-label="make a11y happy" />
      <span
        >Truncated text requires an element. Truncated text requires an element.
        Truncated text requires an element.</span
      >
    </oryx-toggle>
  `;
};

export const WithLongText = Template.bind({});
