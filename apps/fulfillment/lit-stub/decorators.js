/* eslint-disable @typescript-eslint/no-empty-function */

function noopDecoratorFactory() {
  return () => {};
}

export const property = noopDecoratorFactory;

export const state = noopDecoratorFactory;

export const queryAssignedElements = noopDecoratorFactory;
