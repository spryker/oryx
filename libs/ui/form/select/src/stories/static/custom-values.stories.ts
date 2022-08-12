import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { PopoverSelectEvent } from '../../../../../overlays/popover/src/popover.model';
import { sideBySide } from '../../../../../utilities/storybook';
import { selectOptions } from './common';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const logSelect = (ev: CustomEvent<PopoverSelectEvent>): void => {
    console.log(
      'oryx.select value',
      (ev.detail.selected as HTMLOptionElement).value
    );
  };

  return sideBySide(html`
    <oryx-select @oryx.select=${logSelect}>
      <input placeholder="select something from the list" />
      ${selectOptions.map(
        (state) =>
          html`<oryx-option value="val_${state}">${state}</oryx-option>`
      )}
    </oryx-select>
  `);
};

export const CustomValues = Template.bind({});
