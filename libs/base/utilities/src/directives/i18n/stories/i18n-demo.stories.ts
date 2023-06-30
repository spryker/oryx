import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { i18n } from '../i18n.directive';

export default {
  title: `${storybookPrefix}/I18n`,
  args: {
    token: 'example.agree-to-<terms>',
    linkText: '',
    href: 'https://example.com',
    target: '_blank',
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

type Props = {
  token: string;
  href: string;
  target: string;
  linkText?: string;
};

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`${i18n(props.token, {
    terms: {
      value: props.linkText || undefined,
      link: {
        href: props.href,
        target: props.target,
      },
    },
  })}`;
};

export const Demo = Template.bind({});
