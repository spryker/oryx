import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';

export default { title: `${storybookPrefix}/Actions/Toggle/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  return html` <oryx-toggle></oryx-toggle> `;
};

export const ToggleWithoutSlottedContent = Template.bind({});

ToggleWithoutSlottedContent.parameters = {
  a11y: {
    config: {
      rules: [{ id: 'label', enabled: false }],
    },
  },
};
