export const waitForShadowDom = (
  element: Element,
  timeout = 5000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (element.shadowRoot && element.shadowRoot.children.length > 0) {
      return resolve();
    }

    const observer = new MutationObserver(() => {
      if (element.shadowRoot && element.shadowRoot.children.length > 0) {
        cleanup();
        resolve();
      }
    });

    const timerId = setTimeout(() => {
      cleanup();
      reject(new Error('Waiting for shadow DOM content timed out.'));
    }, timeout);

    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    const cleanup = () => {
      observer.disconnect();
      clearTimeout(timerId);
    };
  });
};
