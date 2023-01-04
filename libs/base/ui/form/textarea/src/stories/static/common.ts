import { initMutationObserverForComponent } from '../../../../../utilities';

export const setTextAreaMutationObserver = (): void => {
  initMutationObserverForComponent({
    targetComponent: 'oryx-input',
    targetSelector: '.control',
    sourceSelector: 'textarea',
  });
};
