import { ContentComponentSchema } from '@spryker-oryx/experience';
import { Position } from '@spryker-oryx/ui';
export const schema: ContentComponentSchema = {
  name: 'dropdown',
  group: 'layout',
  options: {
    dropdownPosition: {
      key: '',
      label: 'Position',
      type: 'select',
      options: [
        {
          value: Position.Start,
        },
        {
          value: Position.End,
        },
      ],
    },
    dropdownOnHover: {
      label: 'Show on hover',
      type: 'boolean',
    },
  },
};
