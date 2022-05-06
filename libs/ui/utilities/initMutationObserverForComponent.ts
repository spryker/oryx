interface InitObserverParams {
  targetComponent: string;
  targetSelector: string;
  sourceSelector: string;
}

export function initMutationObserverForComponent({
  targetComponent,
  targetSelector,
  sourceSelector,
}: InitObserverParams): void {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      const component = document.querySelector(targetComponent);
      if (!component) {
        return;
      }
      const observer = new MutationObserver((mutation) => {
        mutation.forEach((mutation) => {
          if (mutation) {
            document.querySelectorAll(targetComponent).forEach((element) => {
              const targetSelectorEl =
                element.shadowRoot?.children[0]?.querySelector(targetSelector);
              const sourceSelectorEl =
                element.querySelector(sourceSelector)?.className;
              if (targetSelectorEl && sourceSelectorEl) {
                targetSelectorEl?.classList.add(sourceSelectorEl);
              }
            });
          }
        });
      });
      observer.observe(component, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    },
    { once: true }
  );
}
