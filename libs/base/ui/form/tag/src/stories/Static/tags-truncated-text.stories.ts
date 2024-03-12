import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Tag/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <div class="row">
      ${Array.from(new Array(5).keys()).map(() => {
        const message = `This is tag with very long text to show how it truncate`;

        return html` <oryx-tag>${message}</oryx-tag> `;
      })}
    </div>

    <style>
      .row {
        display: flex;
        max-width: 500px;
        gap: 5px;
      }
    </style>
  `;
};

export const Truncated = Template.bind({});
