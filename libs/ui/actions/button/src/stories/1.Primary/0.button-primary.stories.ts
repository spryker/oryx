import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../constant';
import { ButtonSize } from '../../button.model';
import '../../index';

export default {
  title: `${storybookPrefix}/actions/Button/Primary`,
} as Meta;

interface Props {
  disabled: boolean;
  loading: boolean;
}

const Template: Story<Props> = (): TemplateResult => {
  const renderButton = (message: string, set: any): TemplateResult => {
    return html` <h1>Primary</h1>
      <div class="button-component">
        <p>Default</p>
        ${Object.values(set).map(
          (size) =>
            html`
                <oryx-button type="primary" size=${size}>
                  <button>${message}</button>
                </oryx-button>
                <oryx-button type="primary" size=${size}>
                  <a href="/">Link</a>
                </oryx-button>
              </div>
            `
        )}
        <p>Disabled</p>
        ${Object.values(set).map(
          (size) =>
            html`
                <oryx-button type="primary" size=${size}>
                  <button disabled>${message}</button>
                </oryx-button>
                <oryx-button type="primary" size=${size}>
                  <a href="/" disabled>Link</a>
                </oryx-button>
              </div>
            `
        )}
        <p>Loading</p>
        ${Object.values(set).map(
          (size) =>
            html`
                <oryx-button loading size=${size}>
                  <button>${message}</button>
                </oryx-button>
                <oryx-button loading size=${size}>
                  <a href="/">Link</a>
                </oryx-button>
              </div>
            `
        )}
      </div>`;
  };

  return html`
    ${renderButton('Button', ButtonSize)}
    <style>
      p {
        width: 54px;
      }

      .button-component {
        width: 650px;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
    </style>
  `;
};

export const ButtonPrimary = Template.bind({});
