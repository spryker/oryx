export const mockLitHtml = (svg: string[], ...values: string[]): string => {
  const template = [svg[0]];

  for (let i = 0; i < values.length; i++) {
    template.push(values[i]);
    template.push(svg[i + 1]);
  }

  return template.join('');
};
