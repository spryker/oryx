import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { tabComponent } from '../../../tab/src/tab.def';
import { tabsComponent } from '../tabs.def';

useComponent(tabsComponent);
useComponent(tabComponent);

export default {
  title: `${storybookPrefix}/Navigations/Tabs`,
  args: {
    appearance: 'primary',
    showShadow: false,
    error: false,
  },
  argTypes: {
    appearance: {
      control: {
        type: 'radio',
        options: ['primary', 'secondary'],
      },
      defaultValue: 'primary',
    },
  },
} as Meta;

interface Props {
  [key: string]: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  const numberOfTabs = 3;

  return html`
    <oryx-tabs appearance="${props.appearance}" ?shadow="${props.showShadow}">
      ${[...Array(numberOfTabs).keys()].map((i) => {
        return html`<oryx-tab for="n${i + 1}" ?error="${props.error}"
          >Tab ${i + 1}</oryx-tab
        > `;
      })}
      ${[...Array(numberOfTabs).keys()].map((i) => {
        return html`<div slot="panels" id="n${i + 1}">
          <p>Сontent for tab ${i + 1}</p>

          <oryx-button size="small">
            <button>button for tab ${i + 1}</button>
          </oryx-button>
        </div> `;
      })}
    </oryx-tabs>
  `;
};

export const TabsDemo = Template.bind({});
