import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';
import {
  CollapsibleAppearance,
  CollapsibleToggleControlType,
} from '../../collapsible.model';

export default {
  title: `${storybookPrefix}/Structure/Collapsible/Static`,
} as Meta;

const variations = [
  {
    name: 'Default',
  },
  {
    name: 'Hovered',
    state: 'pseudo-hover',
  },
  {
    name: 'Focused',
    state: 'pseudo-focus-visible',
  },
];

const sections = [
  {
    title: 'Block appearance',
    appearance: CollapsibleAppearance.Block,
  },
  {
    title: 'Inline appearance',
    appearance: CollapsibleAppearance.Inline,
  },
  {
    title: 'Inline appearance (toggle button)',
    appearance: CollapsibleAppearance.Inline,
    toggleControlType: CollapsibleToggleControlType.TextButton,
  },
  {
    title: 'Inline appearance (custom text, aside content)',
    appearance: CollapsibleAppearance.Inline,
    toggleControlType: CollapsibleToggleControlType.TextButton,
    collapsed: 'hide please',
    expanded: 'show more',
    aside: '$0.99',
  },
];

const Template: Story<unknown> = (): TemplateResult => {
  const renderElement = (): TemplateResult => {
    return html` ${sections.map((section) => {
        return html`
          <h4>${section.title}</h4>
          ${variations.map((variant) => {
            return html`
              <section>
                <div>${variant.name}</div>
                <div class="wrapper ${variant.state ?? ''}">
                  ${collapsible(section)} ${collapsible(section, true)}
                </div>
              </section>
            `;
          })}
        `;
      })}

      <style>
        section {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        section > *:first-child {
          flex: 200px;
        }
        section > * {
          flex: 100%;
        }
        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      </style>`;
  };

  return html`${renderElement()}`;
};

const collapsible = (section: any, open = false): TemplateResult => html`
  <oryx-collapsible
    appearance=${section.appearance}
    .toggleControlType=${section.toggleControlType}
    ?open=${open}
  >
    <span slot="header">Header</span>
    ${when(
      section.expanded,
      () => html`<span slot="expanded">${section.expanded}</span>`
    )}
    ${when(
      section.collapsed,
      () => html`<span slot="collapsed">${section.collapsed}</span>`
    )}
    ${when(
      section.aside,
      () =>
        html`<span slot="aside" style="margin-inline-start: auto"
          >${section.aside}</span
        >`
    )}
    Content
  </oryx-collapsible>
`;

export const States = Template.bind({});
