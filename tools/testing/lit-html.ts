export const mockLitHtml = (value: string[], ...values: string[]): string => {
  const template = [value[0]];

  for (let i = 0; i < values.length; i++) {
    template.push(values[i]);
    template.push(value[i + 1]);
  }

  return template.join('');
};
