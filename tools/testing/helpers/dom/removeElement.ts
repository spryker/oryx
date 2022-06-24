export const removeElement = (selector: string): void => {
  const el = document.querySelector(selector);
  if (el) {
    el.parentElement?.removeChild(el);
  }
};
