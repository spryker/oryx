import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { ButtonType } from '../../index';
import { buttonTypes } from './util';

export default {
  title: `${storybookPrefix}/Actions/Button/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return buttonTypes(
    [
      { name: 'Default' },
      { name: 'Hovered', lightDom: 'pseudo-hover' },
      { name: 'Active', lightDom: 'pseudo-active' },
      { name: 'Focus', lightDom: 'pseudo-focus pseudo-focus-visible' },
      { name: 'Disabled', lightDom: 'pseudo-disabled' },
      { name: 'Confirmed' },
    ],
    ButtonType.Text
  );
};

export const Text = Template.bind({});
