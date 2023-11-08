export const findCssValues = (
  data: string,
  startPos: 'start' | 'top',
  endPos: 'end' | 'bottom'
): string | undefined => {
  const start = findCssValue(data, startPos);
  const end = findCssValue(data, endPos);
  if (!start && !end) return;
  if (start === end) return start;
  return `${start ?? 'auto'} ${end ?? 'auto'}`;
};

/**
 * Extracts a specified position value from a given string.
 *
 * @param data - A string representing CSS values, with each value separated by a space.
 * @param pos - The position to extract the value for, one of: 'top', 'end', 'bottom', or 'start'.
 * @returns The extracted value or `undefined` if the position is not found.
 *
 * @example
 * const padding = '10px 5px 20px';
 * findCssValue(padding, 'top'); // '10px'
 * findCssValue(padding, 'end'); // '5px'
 * findCssValue(padding, 'bottom'); // '20px'
 * findCssValue(padding, 'start'); // '5px'
 */
export const findCssValue = (
  data: string,
  pos: 'top' | 'bottom' | 'start' | 'end'
): string | undefined => {
  const positions = data.split(' ');
  switch (pos) {
    case 'top':
      return positions[0];
    case 'end':
      return positions[1] ?? positions[0];
    case 'bottom':
      return positions[2] ?? positions[0];
    case 'start':
      return positions[3] ?? positions[1] ?? positions[0];
  }
};
