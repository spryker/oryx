import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const iconsList = getAppIcons();

  return html`
    <div class="icon-set">
      ${iconsList.map(
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
