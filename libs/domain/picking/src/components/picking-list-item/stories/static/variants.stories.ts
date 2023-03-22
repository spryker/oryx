import {
  generateVariantsMatrix,
  storybookDefaultViewports,
  Variant,
} from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Picking list item/Static`,
} as Meta;

interface PickingListItemVariant extends Variant {
  options: {
    pickingListId: string;
  };
}

enum CategoryY {
  WITH_NOTE = 'With cart note',
  WITHOUT_NOTE = 'Without cart note',
}

const variants: PickingListItemVariant[] = [
  {
    categoryY: CategoryY.WITH_NOTE,
    categoryX: '',
    options: {
      pickingListId: 'withCartNote',
    },
  },
  {
    categoryY: CategoryY.WITHOUT_NOTE,
    categoryX: '',
    options: {
      pickingListId: 'withoutCartNote',
    },
  },
];

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${generateVariantsMatrix(
      variants,
      ({ options: { pickingListId } }) => html`
        <oryx-picking-list-item
          pickingListId=${pickingListId}
        ></oryx-picking-list-item>
      `,
      { hideXAxisName: true }
    )}

    <style>
      table {
        width: 800px;
      }
    </style>
  `;
};

export const Variants = Template.bind({});

Variants.parameters = {
  chromatic: {
    viewports: [storybookDefaultViewports.mobile.min],
  },
};
