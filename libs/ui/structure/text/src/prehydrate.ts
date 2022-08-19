import { LitElement } from 'lit';

export const truncateFix = async (host: LitElement) => {
  const truncateAfter = Number(host.getAttribute('truncateAfter'));
  const expanded = host.hasAttribute('expanded');
  const textElement = host.shadowRoot?.querySelector('div.text') as HTMLElement;
  if (textElement) {
    host.removeAttribute('requires-truncate');
    host.style.setProperty(
      '--line-clamp',
      truncateAfter > 0 ? truncateAfter.toString() : ''
    );
    host.toggleAttribute('truncate', truncateAfter > 0 && !expanded);

    await 0;

    const isClamped = textElement.scrollHeight > textElement.clientHeight;
    const lineHeight = textElement.style.lineHeight;
    const factor = 1000;
    textElement.style.lineHeight = factor + 'px';
    const height = textElement.getBoundingClientRect().height;
    textElement.style.lineHeight = lineHeight;
    const lineCount = Math.floor(height / factor);
    host.toggleAttribute(
      'requires-truncate',
      isClamped || (expanded && !!truncateAfter && lineCount > truncateAfter)
    );
  }
};
