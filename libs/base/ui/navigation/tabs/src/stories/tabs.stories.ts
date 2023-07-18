import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { TabsProperties } from '../tabs.model';
import { ButtonSize } from '@spryker-oryx/ui/button';

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

          <oryx-button .size=${ButtonSize.Sm}>
            button for tab ${i + 1}
          </oryx-button>
        </div> `;
      })}
    </oryx-tabs>
  `;
};

export const TabsDemo = Template.bind({});
