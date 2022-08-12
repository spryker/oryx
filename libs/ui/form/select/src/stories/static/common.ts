import { html } from 'lit';
import { VariantOptions } from '../../../../../../ui/utilities';
import { VariantsGroup } from '../../../../../utilities/storybook/variants/variants-group';

export interface SelectVariantOptions extends VariantOptions {
  floatLabel?: boolean;
  label?: string;
  value?: string | number;
  disabled?: boolean;
}

export const groups: VariantsGroup<SelectVariantOptions>[] = [
  {
    title: 'Standard label',
    options: {
      floatLabel: false,
    },
  },
  {
    title: 'Floating label',
    options: {
      floatLabel: true,
    },
  },
];

export const selectOptions = ['Red', 'Green', 'Blue'];

export const styles = html`
  <style>
    .stories {
      height: 200px;
    }
  </style>
`;
