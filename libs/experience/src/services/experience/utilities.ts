export const sendPostMessage = (message: unknown): void => {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage(message, '*');
  }
};
