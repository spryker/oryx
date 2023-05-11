import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Filter Button`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-picking-filter-button></oryx-picking-filter-button> `;
};

export const Demo = Template.bind({});
