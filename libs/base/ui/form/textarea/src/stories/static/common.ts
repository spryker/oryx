import { initMutationObserverForComponent } from '@/tools/storybook';

export const setTextAreaMutationObserver = (): void => {
  initMutationObserverForComponent({
    targetComponent: 'oryx-input',
    targetSelector: '.control',
    sourceSelector: 'textarea',
  });
};
