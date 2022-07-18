import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import * as filter from '../../icons/filter.icons';
import * as language from '../../icons/language.icons';
import * as misc from '../../icons/misc.icons';
import * as navigation from '../../icons/navigation.icons';
import * as navigationv2 from '../../icons/navigationv2.icons';
import * as notification from '../../icons/notification.icons';
import * as view from '../../icons/view.icons';
import { Icon, icon } from '../../index';

export default { title: `${storybookPrefix}/graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const renderIconSet = <T = Icon[]>(title: string, set: T): TemplateResult => {
    return html` <h3>${title}</h3>
      <div class="icon-set">
        ${Object.values(set).map(
          (i) => html` <div class="icon">${icon(i)}<span>${i.type}</span></div>`
        )}
      </div>`;
  };

  return html`
    ${renderIconSet('Navigation v2', navigationv2)}
    ${renderIconSet('Navigation', navigation)} ${renderIconSet('Icons', misc)}
    ${renderIconSet('View', view)}
    ${renderIconSet('Notifications', notification)}
    ${renderIconSet('Languages', language)} ${renderIconSet('Filter', filter)}

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

export const Embedded = Template.bind({});
