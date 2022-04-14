import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.storybook/constant';
import {
  FilterIcons,
  LanguageIcons,
  MiscIcons,
  NavigationIcons,
  NavigationIconsV2,
  NotificationIcons,
  ViewIcons,
} from '../../icon.model';
import '../../index';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const renderIconSet = (
    title: string,
    set: Record<string, string>
  ): TemplateResult => {
    return html`
      <h3>${title}</h3>
      <div class="icon-set">
        ${Object.values(set).map(
          (type) =>
            html`
              <div class="icon">
                <oryx-icon type=${type}></oryx-icon>
                <span>${type}</span>
              </div>
            `
        )}
      </div>
    `;
  };

  return html`
    ${renderIconSet('Navigation v2', NavigationIconsV2)}
    ${renderIconSet('Navigation', NavigationIcons)}
    ${renderIconSet('Icons', MiscIcons)} ${renderIconSet('View', ViewIcons)}
    ${renderIconSet('Notifications', NotificationIcons)}
    ${renderIconSet('Languages', LanguageIcons)}
    ${renderIconSet('Filter', FilterIcons)}

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

export const IconSprite = Template.bind({ title: 'test' });
