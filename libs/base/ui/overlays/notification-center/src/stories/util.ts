import { AlertType } from '@spryker-oryx/ui';
import { Schemes } from '@spryker-oryx/ui/notification';
import { NotificationStrategy } from '../index';
import { TAG_NAME } from '../tag';

const types = [
  AlertType.Info,
  AlertType.Success,
  AlertType.Warning,
  AlertType.Error,
];
const schemes = Object.values(Schemes);

const getRandomIndex = (limit: number): number =>
  Math.ceil(Math.random() * limit);
const getRandom = (): boolean => !!Math.round(Math.random());

export const generateNotification = (
  strategy: NotificationStrategy = {}
): NotificationStrategy => {
  return {
    type: AlertType.Info,
    content: 'Title',
    subtext: 'Sub text',
    autoClose: false,
    ...strategy,
  };
};

export const generateRandomNotification = (
  demoType?: AlertType,
  demoScheme?: Schemes
): NotificationStrategy => {
  const type = demoType ?? types[getRandomIndex(types.length)];
  const scheme = demoScheme ?? schemes[getRandomIndex(schemes.length)];

  return {
    ...(type ? { type } : {}),
    ...(scheme ? { scheme } : {}),
    ...(getRandom() ? { subtext: 'Sub text' } : {}),
    closable: getRandom(),
    content: type ? 'Title' : 'Custom content',
    autoClose: false,
  };
};

export const removeAllMountedCenters = (): void => {
  document.querySelectorAll(TAG_NAME).forEach((element) => element.remove());
};
