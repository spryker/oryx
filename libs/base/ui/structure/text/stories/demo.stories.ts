import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { TextProperties } from '../text.model';

export default {
  title: `${storybookPrefix}/Structure/Text`,
  args: {
    content: `<h1>Title</h1><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h2>Sub title</h2><p>Lorem Ipsum has been the industry's standard <a href="spryker.com">dummy text</a> ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
  } as TextProperties,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<TextProperties> = (
  props: TextProperties
): TemplateResult => {
  return html` <oryx-text .content=${props.content}></oryx-text> `;
};
export const TextDemo = Template.bind({});
