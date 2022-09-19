import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { tabsComponent } from '../tabs.def';

useComponent(tabsComponent);

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
    showShadow: {
      control: {
        type: 'check',
        options: [true],
      },
    },
  },
} as Meta;

interface Props {
  [key: string]: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  const numberOfTabs = 3;

  return html`
    <div class="scroll-container">
      <oryx-tabs appearance="${props.appearance}" shadow="${props.showShadow}">
        ${[...Array(numberOfTabs).keys()].map((i) => {
          return html`<oryx-tab for="n${i + 1}" ?error="${props.error}"
            >Tab ${i + 1}</oryx-tab
          > `;
        })}
      </oryx-tabs>

      ${[...Array(numberOfTabs).keys()].map((i) => {
        return html`<oryx-tab-panel id="n${i + 1}">
          <p>Сontent for tab ${i + 1}</p>

          <oryx-button appearence="primary" size="small" style="width: 20%">
            <button>button for tab ${i + 1}</button>
          </oryx-button>
        </oryx-tab-panel> `;
      })}
    </div>

    <style>
      .scroll-container {
        width: ${props.sectionsContainerWidth}%;
      }
      oryx-tabs {
        display: flex;
      }

      oryx-tab-panel {
        padding: 24px;
      }
    </style>
  `;
};

export const TabsDemo = Template.bind({});
