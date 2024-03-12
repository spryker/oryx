import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Options`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const content = html`
    <input value="20" aria-label="label" />
    ${Array.from({ length: 250 }, (_, x) => x + 1).map(
      (item) => html`<oryx-option>${item}</oryx-option>`
    )}
  `;

  return sideBySide(html`<oryx-typeahead>${content}</oryx-typeahead> `);
};

export const ManyOptions = Template.bind({});
