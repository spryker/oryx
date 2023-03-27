import { AlertType } from '@spryker-oryx/ui';
import { Notification, Scheme } from '@spryker-oryx/ui/notification';
import { TAG_NAME } from '../tag';

const types = [
  AlertType.Info,
  AlertType.Success,
  AlertType.Warning,
  AlertType.Error,
];
const schemes = [Scheme.Light, Scheme.Dark];

const getRandomIndex = (limit: number): number =>
  Math.ceil(Math.random() * limit);
const getRandom = (): boolean => !!Math.round(Math.random());

export const generateNotification = (
  strategy: Notification = {}
): Notification => {
  return {
    type: AlertType.Info,
    content: 'Title',
    subtext: 'Sub text',
    autoClose: false,
    ...strategy,
  };
};

export const generateRandomNotification = (options: {
  type?: AlertType;
  scheme?: Scheme;
  closable?: boolean;
  autoClose?: boolean;
  defaultAutoCloseTime?: number;
}): Notification => {
  const type = options.type ?? types[getRandomIndex(types.length)];
  const scheme = options.scheme ?? schemes[getRandomIndex(schemes.length)];

  return {
    ...(type ? { type } : {}),
    ...(scheme ? { scheme } : {}),
    ...(getRandom() ? { subtext: 'Sub text' } : {}),
    closable: options.closable,
    content: type ? 'Title' : 'Custom content',
    autoClose: options.autoClose,
    autoCloseTime: (options.defaultAutoCloseTime ?? 1) * 1000,
  };
};

export const removeAllMountedCenters = (): void => {
  document.querySelectorAll(TAG_NAME).forEach((element) => element.remove());
};
