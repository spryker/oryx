import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { storybookPrefix } from '../../../.constants';
import {
  CollapsibleTextProperties,
  CollapsibleTextToggle,
} from '../collapsible-text.model';

export default {
  title: `${storybookPrefix}/Structure/Collapsible Text`,
  args: {
    lineClamp: 2,
    toggle: CollapsibleTextToggle.Icon,
    text: `<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p><p>when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
  } as Props,
  argTypes: {
    toggle: {
      options: [
        CollapsibleTextToggle.None,
        CollapsibleTextToggle.Icon,
        CollapsibleTextToggle.Text,
      ],
      control: { type: 'select' },
    },
  },
} as Meta;

interface Props extends CollapsibleTextProperties {
  text: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-collapsible-text
      .lineClamp=${props.lineClamp ?? 0}
      .toggle=${props.toggle}
      >${unsafeHTML(props.text)}</oryx-collapsible-text
    >
  `;
};
export const TextDemo = Template.bind({});
