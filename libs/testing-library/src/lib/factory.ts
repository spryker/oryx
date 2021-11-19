import { LibraryWrapper } from './library';
import { LibrarySpecific, Renderer, Screen, Wrapper } from './types';

export let screen: Screen;
export let render: Renderer<Wrapper>;

export const initLibrary = (
  specificRenderer: Renderer<LibrarySpecific>,
  specificScreen: Screen
): void => {
  render = async <O extends Record<string, unknown>>(
    template: string,
    options: O
  ) => {
    const specific = await specificRenderer(template, options);

    return new LibraryWrapper(specific);
  };

  screen = specificScreen;
};
