import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../../../../actions/button/index';
import '../../../../index';
import { Schemes } from '../../../notification.model';
import { bodyBackgroundColor } from '../../util';

export default {
  title: `${storybookPrefix}/Notification/Static/Light`,
} as Meta;

const Template: Story = ({
  backgroundColor = bodyBackgroundColor.options[0],
}): TemplateResult => {
  return html`
    <style>
      body {
        background: ${backgroundColor};
      }
      .wrapper {
        flex: 1 0;
      }
      .title {
        font-size: 18px;
      }
      .content {
        font-style: italic;
      }
      .buttons {
        display: flex;
        justify-content: center;
        margin-top: 10px;
      }
      oryx-button {
        margin: 0 4px;
      }
    </style>
    <oryx-notification scheme=${Schemes.LIGHT}>
      <div class="wrapper">
        <span class="title"> Custom title </span>
        <div class="content">Italic content</div>
        <div class="buttons">
          <oryx-button size="small">
            <button>OK</button>
          </oryx-button>
        </div>
      </div>
    </oryx-notification>
  `;
};
export const CustomContent = Template.bind({});
CustomContent.argTypes = {
  backgroundColor: bodyBackgroundColor,
};
