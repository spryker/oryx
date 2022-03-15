import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';

export default { title: `${storybookPrefix}/Card/Primary` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-card>
      <oryx-icon type="rocket" slot="header"></oryx-icon>
      <h5 slot="header">header</h5>
      <div>content slot</div>
      <div slot="footer">footer slot</div>
    </oryx-card>
  `;
};

export const WithIcon = Template.bind({});
