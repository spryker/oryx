import { FilterStrategy, FilterStrategyType } from '../typeahead.model';

function isNextDelimiter(
  content: string,
  nextIndex: number,
  filter: string,
  delimiters: string[]
): boolean {
  return (
    delimiters.includes(content.charAt(nextIndex)) &&
    content.charAt(nextIndex) !== filter.substring(0, 1)
  );
}

export function generateMarkedHtml(
  indexes: number[],
  content: string,
  filter: string,
  strategy: FilterStrategy
): string {
  let value = '';

  // parts before the first mark
  if (indexes.length > 0 && indexes[0] > -1) {
    let i = indexes[0];
    if (isNextDelimiter(content, i, filter, strategy.delimiters)) i++;

    value += `${content.substring(0, i)}`;
  }

  value += indexes
    .map((valueIndex, i) => {
      let part = '';

      if (valueIndex !== undefined) {
        if (isNextDelimiter(content, valueIndex, filter, strategy.delimiters))
          valueIndex++;

        part += `<mark>${content.substring(
          valueIndex,
          valueIndex + filter.length
        )}</mark>`;

        let nextIndex = indexes[i + 1];
        if (isNextDelimiter(content, nextIndex, filter, strategy.delimiters))
          nextIndex++;

        if (nextIndex > -1)
          part += content.substring(valueIndex + filter.length, nextIndex);
      }
      return part;
    })
    .join('');

  let lastIndex = indexes[indexes.length - 1];

  if (lastIndex !== undefined) {
    if (isNextDelimiter(content, lastIndex, filter, strategy.delimiters))
      lastIndex++;

    value += content.substring(lastIndex + filter.length);
  }

  return value;
}

export function getFilterRegExp(
  value: string,
  strategy: FilterStrategy
): RegExp {
  const delimiters = (
    strategy.delimiters.indexOf(value.charAt(0)) > -1
      ? []
      : [...strategy.delimiters]
  ).join('|');

  let pattern: string;
  switch (strategy.type) {
    case FilterStrategyType.START_OF_WORD:
      pattern = `(?:^|${delimiters})${value}`;
      break;
    case FilterStrategyType.START_WITH:
      pattern = `^(${delimiters})?${value}`;
      break;
    case FilterStrategyType.CONTAINS:
      pattern = `[.]*${value}`;
      break;
  }
  return new RegExp(pattern, 'gi');
}
