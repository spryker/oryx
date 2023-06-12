/* eslint-disable @typescript-eslint/no-empty-function */

function noopDecoratorFactory() {
  return () => {};
}

export const property = noopDecoratorFactory;

export const state = noopDecoratorFactory;

export const query = noopDecoratorFactory;

export const queryAssignedElements = noopDecoratorFactory;

export const customElement = noopDecoratorFactory;
