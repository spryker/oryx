import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigations/Tabs/Static`,
  args: {},
  argTypes: {},
} as Meta;

interface Props {
  [key: string]: string;
}

const Template: Story<Props> = (): TemplateResult => {
  return html` <oryx-tabs sticky="true">
    <oryx-tab>Tab 1</oryx-tab>
    <oryx-tab>Tab 2</oryx-tab>
    <oryx-tab error="true">
      <oryx-icon type="error"></oryx-icon>
      Tab 3</oryx-tab
    >
    <oryx-tab>
      <oryx-icon type="star"></oryx-icon>
      Tab 4</oryx-tab
    >
    <div slot="panels">
      Сontent for sticky tab 1
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
      <oryx-button><button>Button for sticky tab 1</button></oryx-button>
    </div>
    <div slot="panels">Сontent for sticky tab 2</div>
    <div slot="panels">Сontent for sticky tab 3</div>
    <div slot="panels">Сontent for sticky tab 4</div>
  </oryx-tabs>`;
};

export const StickyTabs = Template.bind({});
