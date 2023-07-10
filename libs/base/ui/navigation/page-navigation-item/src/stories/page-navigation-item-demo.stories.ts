import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { PageNavigationItemProps } from '../page-navigation-item.model';

export default {
  title: `${storybookPrefix}/Navigations/Page navigation item`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface Props extends PageNavigationItemProps {
  heading: string;
  content?: string;
  width: number;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <div style="width: ${props.width}%">
      <oryx-page-navigation-item ?active=${props.active}>
        ${props.heading}
        <span slot="content">${props.content}</span>
      </oryx-page-navigation-item>
    </div>
  `;
};

export const PageNavigationItemDemo = Template.bind({});

PageNavigationItemDemo.args = {
  heading: 'Title',
  content:
    'This is content. It can be used for description. This is content. It can be used for description. This is content. It can be used for description. This is content. It can be used for description. This is content. It can be used for description.',
  active: false,
  width: 50,
};

PageNavigationItemDemo.argTypes = {
  width: {
    control: {
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
    },
  },
};
