import { ExperienceMessageData, MessageType } from './data-client';

export const sendPostMessage = <T>(
  message: T extends MessageType ? ExperienceMessageData<T> : unknown,
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
