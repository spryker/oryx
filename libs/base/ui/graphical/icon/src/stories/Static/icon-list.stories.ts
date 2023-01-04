import { AppRef, ThemePlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const iconsList = resolve(AppRef).findPlugin(ThemePlugin)!.getIcons();

  return html`
    <div class="icon-set">
      ${Object.keys(iconsList).map(
        (type) =>
          html`
            <div class="icon">
              <oryx-icon type=${type}></oryx-icon>
              <span>${type}</span>
            </div>
          `
      )}
    </div>

    <style>
      div.icon-set {
        --oryx-icon-size: 24px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
      }

      .icon {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .icon span {
        text-align: center;
        color: var(--oryx-color-ink);
        padding: 10px 0;
        height: 35px;
        font-size: 12px;
        width: 105px;
      }
    </style>
  `;
};

export const List = Template.bind({ title: 'test' });
