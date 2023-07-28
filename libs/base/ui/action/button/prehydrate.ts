import { LitElement } from 'lit';

export const hydrateSlotChange = async (host: LitElement): Promise<void> => {
  const slot = host.shadowRoot?.querySelector<HTMLSlotElement>('slot');

  function handler() {
    const hasIcon = !!host.querySelector('oryx-icon');
    if (hasIcon) {
      host.toggleAttribute('has-text', !!host.textContent?.trim());
    }
    slot?.removeEventListener('slotchange', handler);
  }

  slot?.addEventListener('slotchange', handler);
};
