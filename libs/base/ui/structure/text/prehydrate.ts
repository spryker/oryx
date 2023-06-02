import { LitElement } from 'lit';

export const truncateFix = async (host: LitElement): Promise<void> => {
  const slot = host.shadowRoot?.querySelector<HTMLSlotElement>('div > slot');

  function handler(e: Event) {
    const container = e.target as HTMLSlotElement;
    const lineClampValue = Number(
      getComputedStyle(host).getPropertyValue('--line-clamp')
    );

    if (container && lineClampValue > 0) {
      const lineHeight = container.style.lineHeight;
      const factor = 1000;
      container.style.lineHeight = `${factor}px`;
      const height = container.scrollHeight;
      container.style.lineHeight = lineHeight;
      const linesCount = Math.floor(height / factor);
      host.style.setProperty('--lines-count', String(linesCount));

      if (linesCount <= lineClampValue) {
        return;
      }

      const isDefaultExpanded = host.hasAttribute('defaultExpanded');
      host.toggleAttribute('truncated', !isDefaultExpanded);
      host.toggleAttribute('truncation', true);
    }

    container.removeEventListener('slotchange', handler);
  }

  slot?.addEventListener('slotchange', handler);
};
