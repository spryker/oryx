import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { storybookPrefix } from '../../../../.constants';
import '../index';
import { TextProperties } from '../index';

export default {
  title: `${storybookPrefix}/Structure/Text`,
  args: {
    text: `<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    showToggle: true,
    truncateAfter: 3,
    expanded: false,
    concatenate: true,
  } as Props,
} as Meta;

interface Props extends TextProperties {
  text: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-text
      .showToggle=${!!props.showToggle}
      .truncateAfter=${props.truncateAfter ?? 0}
      ?expanded=${props.expanded}
      ?concatenate=${props.concatenate}
      >${unsafeHTML(props.text)}</oryx-text
    >
  `;
};
export const TextDemo = Template.bind({});
