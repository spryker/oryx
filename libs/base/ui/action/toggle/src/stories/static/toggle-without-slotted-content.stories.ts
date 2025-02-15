import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Actions/Toggle/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  return html` <oryx-toggle></oryx-toggle> `;
};

export const WithoutSlottedContent = Template.bind({});

WithoutSlottedContent.parameters = {
  a11y: {
    config: {
      rules: [{ id: 'label', enabled: false }],
    },
  },
};
