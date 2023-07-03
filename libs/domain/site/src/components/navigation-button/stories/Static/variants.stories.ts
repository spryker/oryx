import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { renderVariants } from './common';

export default {
  title: `${storybookPrefix}/Navigation Button/Static`,
  parameters: {
    chromatic: {
      delay: 3000,
      viewports: [
        storybookDefaultViewports.mobile.min,
        storybookDefaultViewports.desktop.min,
      ],
    },
  },
} as unknown as Meta;

const Template: Story = (): TemplateResult => html` <h4>Variants</h4>
  ${renderVariants()}

  <h4>With badge</h4>
  <oryx-site-navigation-button
    icon="add"
    text="label"
    badge="10"
  ></oryx-site-navigation-button>

  <h4>With long badge</h4>
  <oryx-site-navigation-button
    icon="add"
    text="label"
    badge="super long badge text"
  ></oryx-site-navigation-button>

  <h4>With long label</h4>
  <oryx-site-navigation-button
    icon="add"
    text="super long label text"
  ></oryx-site-navigation-button>

  <h4>Without icon</h4>
  <oryx-site-navigation-button text="label"></oryx-site-navigation-button>

  <h4>Without label</h4>
  <oryx-site-navigation-button icon="add"></oryx-site-navigation-button>`;

export const Variants = Template.bind({});
