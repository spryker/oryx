import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { storybookPrefix } from '../../../../.constants';
import { TextComponent } from '../../text.component';

export default {
  title: `${storybookPrefix}/Structure/Text/Static`,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

const text = unsafeHTML(`
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    <p>Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.</p>
    <p>It has survived not only five centuries, but also the leap into
    electronic typesetting, remaining essentially unchanged. <br />It was
    popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is
    simply dummy text of the printing and typesetting industry.</p>
`);

const Template: Story<unknown> = (): TemplateResult => {
  const toggle = (): void => {
    document.querySelector<TextComponent>('oryx-text')?.toggle();
  };
  return html`
    <oryx-text .truncateAfter=${3} hideToggle>${text}</oryx-text>
    <button @click=${toggle}>toggle</button>
  `;
};
export const CustomToggle = Template.bind({});
