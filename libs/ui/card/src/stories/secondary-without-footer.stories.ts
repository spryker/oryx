import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';

export default { title: `${storybookPrefix}/Card/Secondary` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-card header="header" type="secondary">
      <div>content slot</div>
    </oryx-card>
  `;
};

export const WithoutFooter = Template.bind({});
