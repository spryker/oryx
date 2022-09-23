import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { tabComponent } from '../../../tab/src/tab.def';
import { tabsComponent } from '../tabs.def';
import { TabsProperties } from '../tabs.model';

useComponent([tabsComponent, tabComponent]);

const numberOfTabs = 3;

export default {
  title: `${storybookPrefix}/Navigations/Tabs`,
  args: {
    activeTabIndex: 0,
    appearance: 'primary',
    shadow: false,
    error: false,
  },
  argTypes: {
    activeTabIndex: {
      control: { type: 'select' },
      options: [...Array(numberOfTabs).keys()],
    },
    appearance: {
      control: {
        type: 'radio',
        options: ['primary', 'secondary'],
      },
    },
  },
} as Meta;

interface Props extends TabsProperties {
  error: boolean;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-tabs
      activeTabIndex="${props.activeTabIndex}"
      appearance="${props.appearance}"
      ?shadow="${props.shadow}"
    >
      ${[...Array(numberOfTabs).keys()].map((i) => {
        return html`<oryx-tab
          ?selected="${i === props.activeTabIndex}"
          for="n${i + 1}"
          ?error="${props.error}"
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
