import { LitElement } from 'lit';

export const truncateFix = async (host: LitElement): Promise<void> => {
  function handler() {
    const container = host.shadowRoot?.querySelector('div > *') as HTMLElement;
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

    document.removeEventListener('DOMContentLoaded', handler);
  }

  document.addEventListener('DOMContentLoaded', handler);
};
