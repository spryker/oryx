import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Tag/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <div>
      ${Array.from(new Array(5).keys()).map((key) => {
        const message = `This is tag#${key}`;

        return html`<oryx-tag>${message}</oryx-tag> `;
      })}
    </div>
  `;
};

export const MultipleTags = Template.bind({});
