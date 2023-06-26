import { LitElement } from 'lit';

export const truncateFix = async (host: LitElement): Promise<void> => {
  const slot = host.shadowRoot?.querySelector('slot') as HTMLElement;

  function handler() {
    const lineHeight = parseInt(getComputedStyle(slot).lineHeight);
    const lineCount = slot.scrollHeight / lineHeight;
    const lineClamp = parseInt(slot.style.getPropertyValue('--line-clamp'));
    host.style.setProperty('--line-count', lineCount.toString());
    host.toggleAttribute('requiresToggle', lineCount > lineClamp);

    slot.removeEventListener('slotchange', handler);
  }
  slot.addEventListener('slotchange', handler);
};
