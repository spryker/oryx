import { ExperienceMessageData, MessageType } from './data-transmitter';

export const sendPostMessage = <T>(
  message: T extends MessageType
    ? ExperienceMessageData<T> & {
        type: T;
      }
    : unknown,
  sender?: Window
): void => {
  if (sender) {
    sender.postMessage(message, '*');

    return;
  }

  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage(message, '*');
  }
};
