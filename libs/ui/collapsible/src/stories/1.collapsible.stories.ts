import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../.storybook/constant';
import { IconTypes } from '../../../Graphical/icon';
import '../index';

export default { title: `${storybookPrefix}/Structure/Collapsible` } as Meta;

export interface Props {
  open?: boolean;
  header?: string;
  content?: string;
  iconCollapse?: string;
  iconExpand?: string;
}

const Template: Story<Props> = ({
  open,
  header,
  content,
  iconCollapse,
  iconExpand,
}: Props): TemplateResult => {
  return html`
    <oryx-collapsible ?open=${open}>
      <span slot="header">${header}</span>
      ${when(
        iconExpand,
        () =>
          html`<oryx-icon
            type=${iconExpand}
            size="medium"
            slot="expand-icon"
          ></oryx-icon>`
      )}${when(
        iconCollapse,
        () =>
          html`<oryx-icon
            type=${iconCollapse}
            size="medium"
            slot="collapse-icon"
          ></oryx-icon>`
      )}
      ${content}
    </oryx-collapsible>
  `;
};

export const CollapsibleDemo = Template.bind({});
CollapsibleDemo.args = {
  header: 'Header',
  content: 'Content text',
};
CollapsibleDemo.argTypes = {
  open: {
    control: { type: 'boolean' },
  },
  header: {
    control: { type: 'text' },
  },
  content: {
    control: { type: 'text' },
  },
  iconExpand: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  iconCollapse: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
};
