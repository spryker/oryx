import { getAppIcons } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../.constants';

const icons = getAppIcons();

const breadcrumbs = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Cameras & Camcorders',
    url: '/category',
  },
  {
    label: 'Digital Cameras',
    url: '/category',
  },
];

interface Props {
  divider: IconTypes;
}

export default {
  title: `${storybookPrefix}/Navigations/Breadcrumbs`,
  args: {
    divider: IconTypes.Front,
  },
  argTypes: {
    divider: {
      options: Object.values(icons),
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<Props> = (props): TemplateResult => {
  return html`
    <oryx-breadcrumbs>
      ${breadcrumbs.map(({ label, url }, index) => {
        const isLast = index + 1 === breadcrumbs.length;
        return html`
          <a href=${ifDefined(url)}>${label}</a>
          ${when(
            !isLast,
            () => html`<oryx-icon .type=${props.divider}></oryx-icon>`
          )}
        `;
      })}
    </oryx-breadcrumbs>
  `;
};

export const Demo = Template.bind({});
