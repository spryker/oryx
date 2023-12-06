import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Text`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-text content="<h1>header 1</h1>"></oryx-text>
    <oryx-text content="<h2>header 2</h2>"></oryx-text>
    <oryx-text content="<h3>header 3</h3>"></oryx-text>
    <oryx-text content="<h4>header 4</h4>"></oryx-text>
    <oryx-text content="<h5>header 5</h5>"></oryx-text>
    <oryx-text content="<h6>header 6</h6>"></oryx-text>
    <oryx-text content='<span class="caption">caption</span>'></oryx-text>
    <oryx-text content='<span class="subtitle">subtitle</span>'></oryx-text>
    <oryx-text content="<small>small</small>"></oryx-text>
    <oryx-text content="<strong>strong</strong>"></oryx-text>
    <oryx-text content="<b>bold</b>"></oryx-text>
    <oryx-text content="<a href='spryker.com'>link</a>"></oryx-text>
    <oryx-text content="<button>button</button>"></oryx-text>
  `;
};
export const Static = Template.bind({});
