export const ORYX_STORYBOOK_THEME = 'oryx-theme';
export const ORYX_STORYBOOK_RESOURCE = 'oryx-resource';
export const SET_STORYBOOK_THEME = 'set-oryx-theme';
export const SET_STORYBOOK_RESOURCE = 'set-oryx-resource';

export const getActiveData = (type: string): string | void => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const globals = urlSearchParams.get('globals')?.split(';');

  if (!globals) {
    return;
  }

  for (const global of globals) {
    const [key, value] = global.split(':');

    if (key !== type) {
      continue;
    }

    return value;
  }
};
