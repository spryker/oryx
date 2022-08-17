import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { headlineComponent } from '../component';

useComponent(headlineComponent);

export default {
  title: `${storybookPrefix}/Structure/Headline`,
} as Meta;

interface Props {
  text: string;
  level: string;
}

const getHeader = (text: string, level: string): TemplateResult => {
  switch (level) {
    case 'h1':
      return html`<h1>${text}</h1>`;
      break;
    case 'h2':
      return html`<h2>${text}</h2>`;
      break;
    case 'h3':
      return html`<h3>${text}</h3>`;
      break;
    case 'h4':
      return html`<h4>${text}</h4>`;
      break;
    case 'h5':
      return html`<h5>${text}</h5>`;
      break;
    case 'h6':
      return html`<h6>${text}</h6>`;
      break;
    default:
      return html`<h1>${text}</h1>`;
  }
};

const Template: Story<Props> = ({ text, level }: Props): TemplateResult => {
  return html`<oryx-headline> ${getHeader(text, level)} </oryx-headline>`;
};

export const HeadlineDemo = Template.bind({});

HeadlineDemo.args = {
  text: 'Grumpy wizards make toxic brew',
  level: 'h1',
};

HeadlineDemo.argTypes = {
  level: {
    options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    control: { type: 'select' },
  },
};
