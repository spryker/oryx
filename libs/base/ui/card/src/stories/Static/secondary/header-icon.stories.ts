import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Card/Static/Secondary`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-card type="secondary">
      <oryx-icon type="rocket" slot="heading"></oryx-icon>
      <oryx-heading slot="heading">
        <h5>header</h5>
      </oryx-heading>
      <div>content slot</div>
      <div slot="footer">footer slot</div>
    </oryx-card>
  `;
};

export const HeaderIcon = Template.bind({});
