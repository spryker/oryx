import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { NavigateBackAttributes } from '../navigate-back.model';

export default {
  title: `${storybookPrefix}/Navigate back`,
  args: { url: '/test/url' },
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const Template: Story<NavigateBackAttributes> = (props): TemplateResult => {
  return html`
    <style>
      oryx-picking-navigate-back {
        display: inline-flex;
      }
    </style>
    <oryx-picking-navigate-back .url=${props.url}></oryx-picking-navigate-back>
  `;
};

export const Demo = Template.bind({});
