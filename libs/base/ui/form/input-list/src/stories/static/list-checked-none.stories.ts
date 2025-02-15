import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { InputListDecorator, UxType, input, inputs, text } from '../util';

export default {
  title: `${storybookPrefix}/Form/Input List/Static`,
  decorators: [InputListDecorator()],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${Object.keys(UxType).map(
      (type) => html`
        <oryx-checkbox>
          <input type="checkbox" />
          Select All
        </oryx-checkbox>

        <oryx-input-list heading=${type}>
          ${inputs.map((item) => {
            const inputs = input(item, true);
            switch (type) {
              case UxType.radio:
                return html`<oryx-radio>${inputs}</oryx-radio>`;
              case UxType.toggle:
                return html`<oryx-toggle>${inputs}</oryx-toggle>`;
              case UxType.toggleIcon:
                return html`<oryx-toggle-icon>
                  ${input(item, false)}
                  <oryx-icon .type=${item}></oryx-icon>
                </oryx-toggle-icon>`;
              case UxType.toggleButton:
                return html`<oryx-toggle-icon>
                  ${input(item, false)}
                  <oryx-icon .type=${item}></oryx-icon>
                  <span>${text[item]}</span>
                </oryx-toggle-icon>`;
              default:
                return html`<oryx-checkbox>${inputs}</oryx-checkbox>`;
            }
          })}
        </oryx-input-list>
      `
    )}
  `;
};

export const CheckedNone = Template.bind({});
