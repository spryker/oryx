import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../index';
import {
  add,
  back,
  close,
  closeAll,
  desktop,
  drag,
  dropdown,
  error,
  filter,
  germany,
  Icon,
  icon,
  info,
  invisible,
  loader,
  mark,
  mobile,
  reset,
  rocket,
  search,
  success,
  tablet,
  trash,
  visible,
  warning,
} from '../index';

export default { title: `${storybookPrefix}/Icon` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const renderIconSet = (title: string, set: Icon[]): TemplateResult => {
    return html` <h3>${title}</h3>
      <div class="icon-set">
        ${Object.values(set).map(
          (i) => html`<div class="icon">${icon(i)}<span>${i.type}</span></div>`
        )}
      </div>`;
  };

  return html`
    ${renderIconSet('Navigation', [rocket])}
    ${renderIconSet('View', [desktop, tablet, mobile])}
    ${renderIconSet('Misc', [
      add,
      back,
      close,
      closeAll,
      drag,
      dropdown,
      loader,
      mark,
      reset,
      search,
      trash,
      visible,
      invisible,
    ])}
    ${renderIconSet('Notification', [info, success, warning, error])}
    ${renderIconSet('Languages', [germany])}
    ${renderIconSet('Filter', [filter])}

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
        justify-content: center;
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

export const IconLib = Template.bind({});
