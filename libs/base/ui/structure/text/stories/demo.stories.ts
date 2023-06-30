import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { storybookPrefix } from '../../../.constants';
import { TextProperties } from '../text.model';

export default {
  title: `${storybookPrefix}/Structure/Text`,
  args: {
    text: `<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    hideToggle: false,
    truncateAfter: 3,
    defaultExpanded: false,
  } as Props,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props extends TextProperties {
  text: string;
  truncateAfter: number;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-text
      .truncateAfter=${props.truncateAfter ?? 0}
      .hideToggle=${!!props.hideToggle}
      ?defaultExpanded=${props.defaultExpanded}
      >${unsafeHTML(props.text)}</oryx-text
    >
  `;
};
export const TextDemo = Template.bind({});
