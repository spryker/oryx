import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../../constant';
import '../../../index';

export default {
  title: `${storybookPrefix}/actions/Button/Static/Text`,
} as Meta;

interface Props {
  disabled: boolean;
  loading: boolean;
}

const Template: Story<Props> = (): TemplateResult => {
  const renderButton = (message: string): TemplateResult => {
    return html` <h1>Text with icon</h1>
    <div class="button-component">
      <div class="buttons-row">
        <p>Default</p>
        <oryx-button type="text">
          <button>
            <oryx-icon type="add"></oryx-icon>
            ${message}
          </button>
        </oryx-button>
        <oryx-button type="text">
          <a href="/">
            <oryx-icon type="add"></oryx-icon>
            Link
          </a>
        </oryx-button>
      </div>
    </div>
    <div class="buttons-row">
      <p>Disabled</p>
      <oryx-button type="text">
        <button disabled>
          <oryx-icon type="add"></oryx-icon>
          ${message}
        </button>
      </oryx-button>
      <oryx-button type="text">
        <a href="/" disabled>
          <oryx-icon type="add"></oryx-icon>
          Link
        </a>
      </oryx-button>
    </div>
    </div>
    <div class="buttons-row">

      <p>Loading</p>
      <oryx-button type="text" loading icon>
        <button class="chromatic-ignore">
          <oryx-icon type="add"></oryx-icon>
          ${message}
        </button>
      </oryx-button>
      <oryx-button type="text" loading icon>
        <a class="chromatic-ignore" href="/">
          <oryx-icon type="add"></oryx-icon>
          Link
        </a>
      </oryx-button>
    </div>
    </div>

    </div>`;
  };

  return html`
    ${renderButton('Text')}
    <style>
      p {
        width: 54px;
      }

      .buttons-row {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .button-component {
        gap: 15px;
        display: flex;
        flex-direction: column;
      }
    </style>
  `;
};

export const ButtonTextWithIcon = Template.bind({});
