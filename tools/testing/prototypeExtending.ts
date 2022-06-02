export {};

declare global {
  interface Window {
    HTMLDialogElement?: {
      prototype: {
        showModal: () => void;
        show: () => void;
        close: () => void;
        setAttribute: (attr: string, value: string) => void;
        removeAttribute: (attr: string) => void;
        dispatchEvent: (e: Event) => void;
      };
    };
  }
}

if (window.HTMLDialogElement) {
  window.HTMLDialogElement.prototype.show = function (): void {
    this.setAttribute('open', '');
  };
  window.HTMLDialogElement.prototype.showModal = function (): void {
    this.setAttribute('open', '');
  };
  window.HTMLDialogElement.prototype.close = function (): void {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close', { bubbles: true }));
  };
}

Object.defineProperty(Element.prototype, 'innerText', {
  set: function (value: unknown) {
    this.textContent = value;
  },
  get: function () {
    return this?.textContent;
  },
});
