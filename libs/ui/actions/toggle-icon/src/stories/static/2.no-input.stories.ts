import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../..';
import { storybookPrefix } from '../../../../../.storybook/constant';

export default {
  title: `${storybookPrefix}/actions/Toggle Icon/Static`,
} as Meta;

const styles = html`
  <style>
    .container {
      background: var(--oryx-color-neutral-lighter);
      height: 20px;
    }
  </style>
`;

const NoInputTemplate: Story = (): TemplateResult => html`
  <div class="container"></div>
  <oryx-toggle-icon></oryx-toggle-icon>
  <div class="container"></div>
  ${styles}
`;

export const NoInputToggleIcon = NoInputTemplate.bind({});
