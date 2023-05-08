import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Filters`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-picking-filters open></oryx-picking-filters>
  `;
};

export const Demo = Template.bind({});
