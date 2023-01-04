/**
 * Extract props as string union from a string delimited by start and end strings.
 *
 * @example
 * ExtractStrProps<'something-this_is_prop-another', '-'> -> 'this_is_prop'
 * ExtractStrProps<'something-this_is_prop-another', '-', '_'> -> 'this'
 * ExtractStrProps<'something-this_is_prop-another', '_'> -> 'is'
 * ExtractStrProps<'something-this_is_prop-another', '_', '-'> -> 'is_prop'
 */
export type ExtractStrProps<
  Str extends string,
  DelimiterStart extends string,
  DelimiterEnd extends string = DelimiterStart,
  Props extends string = never
> =
  // Early exit for non-literal strings
  string extends Str
    ? never
    : // Return all collected props for empty string
    Str extends ''
    ? Props
    : // Extract prop match recursively
    Str extends `${string}${DelimiterStart}${infer P}${DelimiterEnd}${infer TRest}`
    ? ExtractStrProps<TRest, DelimiterStart, DelimiterEnd, Props | P>
    : // Otherwise return all collected props
      Props;
