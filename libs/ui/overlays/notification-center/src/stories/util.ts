import { Schemes, Types } from '@spryker-oryx/ui/notification';
import { NotificationStrategy } from '../index';
import { TAG_NAME } from '../tag';

const types = Object.values(Types);
const schemes = Object.values(Schemes);

const getRandomIndex = (limit: number): number =>
  Math.ceil(Math.random() * limit);
const getRandom = (): boolean => !!Math.round(Math.random());

export const generateNotification = (
  strategy: NotificationStrategy = {}
): NotificationStrategy => {
  return {
    type: Types.INFO,
    content: 'Title',
    subtext: 'Sub text',
    ...strategy,
  };
};

export const generateRandomNotification = (): NotificationStrategy => {
  const type = types[getRandomIndex(types.length)];
  const scheme = schemes[getRandomIndex(schemes.length)];

  return {
    ...(type ? { type } : {}),
    ...(scheme ? { scheme } : {}),
    ...(getRandom() ? { subtext: 'Sub text' } : {}),
    closable: getRandom(),
    content: type ? 'Title' : 'Custom content',
  };
};

export const removeAllMountedCenters = (): void => {
  document.querySelectorAll(TAG_NAME).forEach((element) => element.remove());
};
