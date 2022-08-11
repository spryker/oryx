import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Headline/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-headline>
      <h1>Grumpy wizards make toxic brew</h1>
    </oryx-headline>
    <oryx-headline>
      <h2>Grumpy wizards make toxic brew</h2>
    </oryx-headline>
    <oryx-headline>
      <h3>Grumpy wizards make toxic brew</h3>
    </oryx-headline>
    <oryx-headline>
      <h4>Grumpy wizards make toxic brew</h4>
    </oryx-headline>
    <oryx-headline>
      <h5>Grumpy wizards make toxic brew</h5>
    </oryx-headline>
    <oryx-headline>
      <h6>Grumpy wizards make toxic brew</h6>
    </oryx-headline>

    <style>
      oryx-headline {
        margin-block-end: 30px;
      }
    </style>
  `;
};

export const States = Template.bind({});
