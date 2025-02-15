import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html, svg } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { icon } from '../../icon.factory';
import { Icon } from '../../icon.model';
import { IconTypes } from '../../icon.types';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const remove: Icon = {
  type: `Embed ${IconTypes.Remove}`,
  source: svg`
    <circle cx="12" cy="12" r="12" style="fill:var(--oryx-color-neutral-6, #eeeeee)"/>
    <path d="M16.1425 7.85748C15.6659 7.38084 14.8931 7.38084 14.4165 7.85748L12 10.2739L9.58353 7.85748C9.10689 7.38084 8.33411 7.38084 7.85748 7.85748C7.38084 8.33411 7.38084 9.10689 7.85748 9.58353L10.2739 12L7.85748 14.4165C7.38084 14.8931 7.38084 15.6659 7.85748 16.1425C8.33411 16.6192 9.10689 16.6192 9.58353 16.1425L12 13.7261L14.4165 16.1425C14.8931 16.6192 15.6659 16.6192 16.1425 16.1425C16.6192 15.6659 16.6192 14.8931 16.1425 14.4165L13.7261 12L16.1425 9.58353C16.6192 9.10689 16.6192 8.33411 16.1425 7.85748Z" />
  `,
};

const filter: Icon = {
  type: `Embed ${IconTypes.Filter}`,
  source: svg`<path d="M7.675 18V12.375H9.175V14.45H18V15.95H9.175V18H7.675ZM0 15.95V14.45H6.175V15.95H0ZM4.675 11.8V9.75H0V8.25H4.675V6.15H6.175V11.8H4.675ZM7.675 9.75V8.25H18V9.75H7.675ZM11.825 5.625V0H13.325V2.05H18V3.55H13.325V5.625H11.825ZM0 3.55V2.05H10.325V3.55H0Z"/>
`,
};

const mockEmbeddedIcons = [remove, filter];

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div class="icon-set">
      ${mockEmbeddedIcons.map(
        (i) => html` <div class="icon">${icon(i)}<span>${i.type}</span></div>`
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

export const Embedded = Template.bind({});
