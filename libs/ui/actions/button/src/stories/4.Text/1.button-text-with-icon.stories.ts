import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../constant';
import { ButtonSize } from '../../button.model';
import '../../index';

export default {
  title: `${storybookPrefix}/actions/Button/Text`,
} as Meta;

interface Props {
  disabled: boolean;
  loading: boolean;
}

const Template: Story<Props> = (): TemplateResult => {
  const renderButton = (message: string, set: any): TemplateResult => {
    return html` <h1>Text with icon</h1>
      <div class="button-component">
        <p>Default</p>
        ${Object.values(set).map(
          (size) =>
            html`
            <oryx-button type="text" size=${size}>
              <button>
                <oryx-icon type="add"></oryx-icon>
                ${message}
              </button>
            </oryx-button>
            </div>
          `
        )}
        <p>Disabled</p>
        ${Object.values(set).map(
          (size) =>
            html`
            <oryx-button type="text" size=${size}>
              <button disabled>
                <oryx-icon type="add"></oryx-icon>
                ${message}
              </button>
            </oryx-button>
            </div>
          `
        )}
        <p>Loading</p>
        ${Object.values(set).map(
          (size) =>
            html`
            <oryx-button type="text" loading size=${size}>
              <button class="chromatic-ignore">
                <oryx-icon type="add"></oryx-icon>
                ${message}
              </button>
            </oryx-button>
            </div>
          `
        )}
      </div>`;
  };

  return html`
    ${renderButton('Text', ButtonSize)}
    <style>
      p {
        width: 54px;
      }

      .button-component {
        width: 350px;
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
      }
    </style>
  `;
};

export const ButtonTextWithIcon = Template.bind({});
