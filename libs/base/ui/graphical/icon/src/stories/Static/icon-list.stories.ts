import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { IconTypes } from '../../icon.types';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const iconsList = getAppIcons();
  const deprecated = [
    IconTypes.Back,
    IconTypes.ArrowBack,
    IconTypes.NavigationArrow,
    IconTypes.Bottom,
    IconTypes.Top,
    IconTypes.ArrowsOutward,
  ];

  return html`
    <div class="icon-set">
      ${iconsList
        .filter((icon) => !deprecated.includes(icon as IconTypes))
        .map(
          (type) =>
            html`
              <div class="icon">
                <oryx-icon .type=${type}></oryx-icon>
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
        color: var(--oryx-color-neutral-12);
        padding: 10px 0;
        height: 35px;
        font-size: 12px;
        width: 105px;
      }
    </style>
  `;
};

export const List = Template.bind({ title: 'test' });
