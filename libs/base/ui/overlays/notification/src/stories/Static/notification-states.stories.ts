import { AlertType } from '@spryker-oryx/ui';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../.constants';
import { Scheme } from '../../notification.model';
import { bodyBackgroundColor } from '../util';
import { ButtonSize } from '@spryker-oryx/ui/button';

const alertTypes = [
  AlertType.Info,
  AlertType.Success,
  AlertType.Warning,
  AlertType.Error,
];

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

const getNotification = (props: {
  type?: AlertType;
  scheme?: Scheme;
  closable?: boolean;
  floating?: boolean;
  subtext?: string;
  title?: string;
}): TemplateResult => {
  return html`<oryx-notification
    .type=${props.type}
    .scheme=${props.scheme}
    ?closable=${props.closable}
    ?floating=${props.floating}
  >
    ${props.title ?? props.type ?? 'title'}
    ${when(
      props.subtext,
      () => html`<span slot="subtext">${props.subtext}</span>`
    )}
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
      ${[Scheme.Light, Scheme.Dark].map(
        (scheme) => html`
          <section>
            <h3>Closable (${scheme})</h3>
            ${getNotification({ scheme, closable: true })}
            ${alertTypes.map((type) =>
              getNotification({ type, scheme, closable: true })
            )}

            <h3>Subtext (${scheme})</h3>
            ${getNotification({ scheme, subtext: 'subtext' })}
            ${alertTypes.map((type) =>
              getNotification({ type, scheme, subtext: 'subtext' })
            )}

            <h3>Floating (${scheme})</h3>
            ${getNotification({ scheme, floating: true })}
            ${alertTypes.map((type) =>
              getNotification({ type, scheme, floating: true })
            )}

            <h3>Long text (${scheme})</h3>
            ${getNotification({
              scheme,
              title: longTitle,
              subtext: longText,
            })}
            ${alertTypes.map((type) =>
              getNotification({
                type,
                scheme,
                title: longTitle,
                subtext: longText,
              })
            )}

            <h3>Custom content (${scheme})</h3>
            ${alertTypes.map(
              (type) => html`
                <oryx-notification type=${type} scheme=${scheme}>
                  <div class="custom">
                    <span class="title"> Custom title </span>
                    <div class="content">Italic content</div>
                    <div class="buttons">
                      <oryx-button .size=${ButtonSize.Sm}> OK </oryx-button>
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
