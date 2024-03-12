import { CheckboxComponent } from '@spryker-oryx/ui/checkbox';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';
import { Direction } from '../../../../src/utilities/model';
import { InputListComponent } from '../input-list.component';
import { UxType, inputs, text } from './util';

interface Props {
  title: string;
  direction: Direction;
  inputType: 'radio' | 'checkbox';
  uxType: UxType;
  errorMessage?: string;
  hasError?: boolean;
  disabled?: boolean;
}

export default {
  title: `${storybookPrefix}/Form/Input List`,
  args: {
    disabled: false,
    direction: Direction.horizontal,
    inputType: 'checkbox',
    uxType: UxType.checkbox,
    errorMessage: '',
    hasError: false,
  },
  argTypes: {
    direction: {
      options: Object.values(Direction),
      control: { type: 'select' },
    },
    inputType: {
      options: ['checkbox', 'radio'],
      control: { type: 'select' },
    },
    uxType: {
      options: Object.values(UxType),
      control: { type: 'select' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const onInput = (): void => {
    const selectAll = document.querySelector('#selectAll') as CheckboxComponent;
    if (!selectAll) return;
    const selectAllInput = selectAll.querySelector('input') as HTMLInputElement;

    const selectedItems = document.querySelectorAll<HTMLInputElement>(
      'oryx-input-list input:checked'
    );
    selectAllInput.checked = inputs.length === selectedItems.length;
    selectAll.intermediate =
      !!selectedItems.length && selectedItems.length < inputs.length;
  };

  const toggleAll = (): void => {
    const list = document.querySelector(
      'oryx-input-list'
    ) as InputListComponent;

    const force = (
      document.getElementById('selectAllInput') as HTMLInputElement
    ).checked;

    list.toggle(force);
  };

  const input = (item: string, hasText = true): TemplateResult => html`
    <input
      .type=${props.inputType === 'radio' ? 'radio' : 'checkbox'}
      name="device"
      value="${item}"
      ?disabled=${props.disabled}
    />
    ${when(hasText, () => html`${text[item]}`)}
  `;

  return html`
    ${when(
      props.inputType !== 'radio',
      () => html`
        <oryx-checkbox id="selectAll">
          <input type="checkbox" @input=${toggleAll} id="selectAllInput" />
          Select All
        </oryx-checkbox>
      `
    )}

    <oryx-input-list
      heading="Devices"
      @input=${onInput}
      direction=${props.direction}
      ?hasError=${props.hasError}
      .errorMessage=${props.errorMessage}
    >
      ${inputs.map((item) => {
        switch (props.uxType) {
          case UxType.radio:
            return html`<oryx-radio>${input(item)}</oryx-radio>`;
          case UxType.toggle:
            return html`<oryx-toggle>${input(item)}</oryx-toggle>`;
          case UxType.toggleIcon:
            return html`<oryx-toggle-icon
              >${input(item, false)}<oryx-icon .type=${item}></oryx-icon
            ></oryx-toggle-icon>`;
          case UxType.toggleButton:
            return html`<oryx-toggle-icon
              >${input(item, false)}<oryx-icon .type=${item}></oryx-icon>
              <span>${text[item]}</span>
            </oryx-toggle-icon>`;
          default:
            return html`<oryx-checkbox>${input(item)}</oryx-checkbox>`;
        }
      })}
    </oryx-input-list>
  `;
};

export const InputListDemo = Template.bind({});
