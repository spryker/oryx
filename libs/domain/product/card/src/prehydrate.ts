import { LitElement } from 'lit';

export const preventPropagatingFix = async (
  host: LitElement
): Promise<void> => {
  const preventPropagating = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  host.shadowRoot
    ?.querySelectorAll('oryx-cart-add, oryx-button')
    .forEach((element) => {
      element.addEventListener('click', preventPropagating);
    });
};
