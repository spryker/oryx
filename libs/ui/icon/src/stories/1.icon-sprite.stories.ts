import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import {
  FilterIcons,
  IconProperties,
  LanguageIcons,
  MiscIcons,
  NavigationIcons,
  NotificationIcons,
  ViewIcons,
} from '../icon.model';
import '../index';

export default { title: `${storybookPrefix}/Icon` } as Meta;

const Template: Story<IconProperties> = ({
  sprite,
}: IconProperties): TemplateResult => {
  const renderIconSet = (title: string, set: any): TemplateResult => {
    return html` <h3>${title}</h3>
      <div class="icon-set">
        ${Object.values(set).map(
          (type) =>
            html`
              <div class="icon">
                <oryx-icon .type=${type} .sprite=${sprite}></oryx-icon>
                <span>${type}</span>
              </div>
            `
        )}
      </div>`;
  };

  return html`
    ${renderIconSet('Navigation', NavigationIcons)}
    ${renderIconSet('View', ViewIcons)}
    ${renderIconSet('Misc icons', MiscIcons)}
    ${renderIconSet('Notifications', NotificationIcons)}
    ${renderIconSet('Languages', LanguageIcons)}
    ${renderIconSet('Filter', FilterIcons)}

    <style>
      div.icon-set {
        --oryx-icon-size: 40px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .icon {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .icon span {
        text-align: center;
        color: var(--oryx-color-neutral);
        padding: 10px 0;
        width: 50px;
        height: 35px;
        font-size: 12px;
      }
    </style>
  `;
};

export const IconSprite = Template.bind({ title: 'test' });

IconSprite.args = {
  sprite: 'assets/icons.svg',
} as IconProperties;
