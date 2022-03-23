import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';

export default { title: `${storybookPrefix}/Card/Static/Primary` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-card header="header">
      <div>content slot</div>
    </oryx-card>
  `;
};

export const WithoutFooter = Template.bind({});
