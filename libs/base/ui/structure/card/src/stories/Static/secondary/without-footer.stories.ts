import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Card/Static/Secondary`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-card heading="header" type="secondary">
      <div>content slot</div>
    </oryx-card>
  `;
};

export const WithoutFooter = Template.bind({});
