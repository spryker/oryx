import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../index';
import {
  actions,
  add,
  administration,
  america,
  back,
  calendar,
  catalog,
  close,
  comment,
  content,
  copy,
  create,
  customer,
  darkMode,
  dashboard,
  dashboards,
  desktop,
  disconnect,
  drag,
  dropdown,
  dropUp,
  edit,
  error,
  fastForward,
  file,
  filter,
  filters,
  france,
  front,
  germany,
  goldPartner,
  help,
  Icon,
  icon,
  imports,
  info,
  inputError,
  inputStepper,
  integration,
  invisible,
  lightMode,
  link,
  loader,
  locker,
  maintenance,
  mark,
  marketplace,
  maximize,
  menu,
  merchandising,
  merchant,
  merchantProfile,
  minimize,
  minus,
  mobile,
  navigationArrow,
  orders,
  placeholder,
  planet,
  popular,
  products,
  profile,
  ratings,
  remove,
  reset,
  rocket,
  sales,
  search,
  settings,
  silverPartner,
  sort,
  spain,
  star,
  success,
  tablet,
  textAreaResizable,
  trash,
  users,
  visible,
  warning,
} from '../../index';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const renderIconSet = (title: string, set: Icon[]): TemplateResult => {
    return html` <h3>${title}</h3>
      <div class="icon-set">
        ${Object.values(set).map(
          (i) => html` <div class="icon">${icon(i)}<span>${i.type}</span></div>`
        )}
      </div>`;
  };

  return html`
    ${renderIconSet('Navigation v2', [
      sales,
      dashboard,
      catalog,
      customer,
      maintenance,
      merchantProfile,
      administration,
      users,
      marketplace,
      merchandising,
      content,
      ratings,
      rocket,
    ])}
    ${renderIconSet('Navigation', [
      dashboards,
      orders,
      merchant,
      products,
      darkMode,
      lightMode,
      profile,
    ])}
    ${renderIconSet('Icons', [
      close,
      filters,
      search,
      settings,
      sort,
      calendar,
      imports,
      reset,
      copy,
      maximize,
      minimize,
      actions,
      drag,
      inputStepper,
      navigationArrow,
      inputError,
      mark,
      comment,
      remove,
      minus,
      add,
      fastForward,
      create,
      edit,
      trash,
      file,
      visible,
      invisible,
      star,
      integration,
      placeholder,
      dropdown,
      dropUp,
      back,
      front,
      loader,
      disconnect,
      locker,
      textAreaResizable,
      link,
      help,
      menu,
    ])}
    ${renderIconSet('View', [desktop, tablet, mobile])}
    ${renderIconSet('Notifications', [success, warning, error, info])}
    ${renderIconSet('Languages', [planet, germany, america, spain, france])}
    ${renderIconSet('Filter', [filter, popular, goldPartner, silverPartner])}

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

export const IconEmbedded = Template.bind({});
