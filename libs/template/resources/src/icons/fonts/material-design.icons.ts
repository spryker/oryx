import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const materialDesignIcons: IconMapper = {
  id: 'material-icons',
  mapping: {
    [IconTypes.Previous]: 'arrow_back',
    [IconTypes.Next]: 'arrow_forward',
  },
};

export const materialDesignLink = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  [materialDesignIcons.id!]:
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block',
};
