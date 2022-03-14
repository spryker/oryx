import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../constant';
import { ButtonSize } from '../../button.model';
import '../../index';

export default {
  title: `${storybookPrefix}/actions/Button/button-variations`,
} as Meta;

interface Props {
  disabled: boolean;
  loading: boolean;
}

const Template: Story<Props> = (): TemplateResult => {
  const renderButton = (
    message: string,
    set: any,
    icon: string
  ): TemplateResult => {
    return html` <h1>Primary with icon</h1>
      <div class="button-default">
        <p>Default</p>
        ${Object.values(set).map(
          (type) =>
            html`
              <div class="button-component">
                <oryx-button .icon=${icon} .type="primary" size=${type}>
                  <button>${message}</button>
                </oryx-button>
              </div>
            `
        )}
      </div>
      <div class="button-disabled">
        <p>Disabled</p>
        ${Object.values(set).map(
          (type) =>
            html`
              <div class="button-component">
                <oryx-button .icon=${icon} type="primary" size=${type}>
                  <button ?disabled=${true}>${message}</button>
                </oryx-button>
              </div>
            `
        )}
      </div>
      <div class="button-loading">
        <p>Loading</p>
        ${Object.values(set).map(
          (type) =>
            html`
              <div class="button-component">
                <oryx-button .icon=${icon} .loading=${true} size=${type}>
                  <button>${message}</button>
                </oryx-button>
              </div>
            `
        )}
      </div>`;
  };

  return html`
    ${renderButton('Button', ButtonSize, 'add')}
    <style>
      p {
        width: 54px;
      }
      .button-component {
        padding: 0 10px 10px 10px;
      }
      .button-default,
      .button-disabled,
      .button-loading {
        display: flex;
      }
    </style>
  `;
};

export const ButtonPrimaryWithIcon = Template.bind({});
