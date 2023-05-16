import { IconTypes } from '@spryker-oryx/themes/icons';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { NavigationButtonAttributes } from '../navigation-button.model';

export default {
  title: `${storybookPrefix}/Navigation Button`,
  args: {
    url: '',
    icon: 'add',
    text: 'label',
    badge: '',
  },
  argTypes: {
    icon: {
      options: ['', ...Object.values(IconTypes)],
      control: { type: 'select' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<NavigationButtonAttributes> = (props): TemplateResult => {
  return html` <oryx-site-navigation-button
    url=${props.url}
    icon=${props.icon}
    text=${props.text}
    badge=${props.badge}
  ></oryx-site-navigation-button>`;
};

export const Demo = Template.bind({});
