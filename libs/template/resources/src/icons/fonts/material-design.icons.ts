import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

const styles = { direction: true };
export const materialDesignIcons: IconMapper = {
  id: 'material-icons',
  mapping: {
    [IconTypes.Carrier]: { text: 'local_shipping', styles },
    [IconTypes.Forward]: { text: 'chevron_right', styles },
    [IconTypes.Backward]: { text: 'chevron_left', styles },
    [IconTypes.ArrowBackward]: { text: 'arrow_back', styles },
    [IconTypes.ArrowForward]: { styles },
    [IconTypes.ArrowOutward]: { styles },
  },
};

export const materialDesignLink = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  [materialDesignIcons.id!]:
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block',
};
