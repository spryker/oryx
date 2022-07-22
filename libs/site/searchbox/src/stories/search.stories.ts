import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { setupSuggestionMocks } from './suggestion-mocks';

export default {
  title: `${storybookPrefix}/Search`,
  loaders: [setupSuggestionMocks],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<site-searchbox />`;
};

export const Search = Template.bind({});
