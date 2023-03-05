import { AlertType } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../.constants';
import { Schemes } from '../../notification.model';
import { bodyBackgroundColor } from '../util';

export default {
  title: `${storybookPrefix}/Overlays/Notification/Static`,
  args: {
    backgroundColor: bodyBackgroundColor.options[0],
  },
  argTypes: {
    backgroundColor: bodyBackgroundColor,
  },
} as Meta;

const longTitle =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim';
const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const getNotification = (
  type: AlertType,
  scheme: Schemes,
  closable = false,
  floating = false,
  subtext: string,
  title = type
): TemplateResult => {
  return html`<oryx-notification
    type=${type}
    scheme=${scheme}
    ?closable=${closable}
    ?floating=${floating}
  >
    ${title}
    ${when(subtext, () => html`<span slot="subtext">${subtext}</span>`)}
  </oryx-notification>`;
};

const Template: Story = ({ backgroundColor }): TemplateResult => {
  return html`
    <style>
      body {
        background: ${backgroundColor};
      }
      oryx-notification {
        margin-bottom: 18px;
      }

      .wrapper {
        display: flex;
        flex-direction: row;
        gap: 20px;
      }
      section {
        flex: 50%;
      }

      .custom {
        flex: 1 0;
      }
      .custom .title {
        font-size: 18px;
      }
      .custom .content {
        font-style: italic;
      }
      .custom .buttons {
        display: flex;
        justify-content: center;
        margin-top: 10px;
      }
      .custom oryx-button {
        margin: 0 4px;
      }
    </style>

    <div class="wrapper">
      ${Object.values(Schemes).map(
        (scheme) => html`
          <section>
            <h3>Closable (${scheme})</h3>
            ${[
              AlertType.Info,
              AlertType.Success,
              AlertType.Warning,
              AlertType.Error,
            ].map((type) => getNotification(type, scheme, true))}

            <h3>Subtext (${scheme})</h3>
            ${[
              AlertType.Info,
              AlertType.Success,
              AlertType.Warning,
              AlertType.Error,
            ].map((type) =>
              getNotification(type, scheme, false, false, `subtext`)
            )}

            <h3>Floating (${scheme})</h3>
            ${[
              AlertType.Info,
              AlertType.Success,
              AlertType.Warning,
              AlertType.Error,
            ].map((type) => getNotification(type, scheme, false, true))}

            <h3>Long text (${scheme})</h3>
            ${[
              AlertType.Info,
              AlertType.Success,
              AlertType.Warning,
              AlertType.Error,
            ].map((type) =>
              getNotification(type, scheme, false, false, longText, longTitle)
            )}

            <h3>Custom content (${scheme})</h3>
            ${[
              AlertType.Info,
              AlertType.Success,
              AlertType.Warning,
              AlertType.Error,
            ].map(
              (type) => html`
                <oryx-notification type=${type} scheme=${scheme}>
                  <div class="custom">
                    <span class="title"> Custom title </span>
                    <div class="content">Italic content</div>
                    <div class="buttons">
                      <oryx-button size="small">
                        <button>OK</button>
                      </oryx-button>
                    </div>
                  </div>
                </oryx-notification>
              `
            )}
          </section>
        `
      )}
    </div>
  `;
};
export const States = Template.bind({});
