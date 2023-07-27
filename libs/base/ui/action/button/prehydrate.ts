import { LitElement } from 'lit';

export const hydrateSlotChange = async (host: LitElement): Promise<void> => {
  const slot = host.shadowRoot?.querySelector('slot') as HTMLElement;

  function handler() {
    host.toggleAttribute('has-text', !!host.textContent?.trim());
    host.toggleAttribute('has-icon', !!host.querySelector('oryx-icon'));
    slot.removeEventListener('slotchange', handler);
  }

  slot?.addEventListener('slotchange', handler);
};
