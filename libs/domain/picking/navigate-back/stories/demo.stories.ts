import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { NavigateBackAttributes } from '../navigate-back.model';

export default {
  title: `${storybookPrefix}/Navigate Back`,
  args: { url: '/test/url' },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<NavigateBackAttributes> = (props): TemplateResult => {
  return html`
    <style>
      oryx-navigate-back {
        display: inline-flex;
      }
    </style>
    <oryx-navigate-back .url=${props.url}></oryx-navigate-back>
  `;
};

export const Demo = Template.bind({});
