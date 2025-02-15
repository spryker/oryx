import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { ContentTextContent } from '../text.model';

export default {
  title: `${storybookPrefix}/text`,
  args: {
    text: ` asdfas  <b style="font-family:'Agdasima';font-size:40px;color:red">test</b>`,
  },
} as Meta;

const Template: Story<ContentTextContent> = (props): TemplateResult => {
  return html`
    <oryx-content-text .content=${{ text: props.text }}></oryx-content-text>
  `;
};

export const Demo = Template.bind({});
