import { LitElement } from 'lit';
import { CollapsibleTextComponent } from './collapsible-text.component';

export const truncateFix = async (host: LitElement): Promise<void> => {
  const slot = host.shadowRoot?.querySelector<CollapsibleTextComponent>(
    'slot'
  ) as CollapsibleTextComponent;

  function handler() {
    const totalLines =
      slot.scrollHeight /
      Number(getComputedStyle(slot).lineHeight.split('px')[0]);
    host.style.setProperty('--line-count', totalLines.toString());
    const lineClamp = Number(slot.style.getPropertyValue('--line-clamp'));
    host.toggleAttribute('requiresToggle', totalLines > lineClamp);
    slot.removeEventListener('slotchange', handler);
  }
  slot.addEventListener('slotchange', handler);
};
