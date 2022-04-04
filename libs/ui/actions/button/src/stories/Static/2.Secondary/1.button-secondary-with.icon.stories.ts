import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../../constant';
import { ButtonSize } from '../../../button.model';
import '../../../index';

export default {
  title: `${storybookPrefix}/actions/Button/Static/Secondary`,
} as Meta;

interface Props {
  disabled: boolean;
}

const Template: Story<Props> = (): TemplateResult => {
  const renderButton = (
    message: string,
    set: any,
    icon: string
  ): TemplateResult => {
    return html` <h1>Secondary with icon</h1>
      <div class="button-component">
        <p>Default</p>
        ${Object.values(set).map(
          (size) =>
            html`
              <oryx-button type="secondary" size=${size} outline icon>
                <button>
                  <oryx-icon type=${icon}></oryx-icon>
                  ${message}
                </button>
              </oryx-button>
              <oryx-button type="secondary" size=${size} outline icon>
                <a href="/">
                  <oryx-icon type=${icon}></oryx-icon>
                  Link
                </a>
              </oryx-button>
              </div>
            `
        )}
        <p>Disabled</p>
        ${Object.values(set).map(
          (size) =>
            html`
              <oryx-button size=${size} icon>
                <button disabled>
                  <oryx-icon type=${icon}></oryx-icon>
                  ${message}
                </button>
              </oryx-button>
              <oryx-button size=${size} icon>
                <a href="/" disabled>
                  <oryx-icon type=${icon}></oryx-icon>
                  Link
                </a>
              </oryx-button>
              </div>
            `
        )}
        <p>Loading</p>
        ${Object.values(set).map(
          (size) =>
            html`
              <oryx-button loading type="secondary" size=${size} outline icon>
                <button class="chromatic-ignore">
                  <oryx-icon type=${icon}></oryx-icon>
                  ${message}
                </button>
              </oryx-button>
              <oryx-button loading type="secondary" size=${size} outline icon>
                <a class="chromatic-ignore" href="/">
                  <oryx-icon type=${icon}></oryx-icon>
                  Link
                </a>
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
        width: 750px;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
    </style>
  `;
};

export const ButtonSecondaryWithIcon = Template.bind({});
