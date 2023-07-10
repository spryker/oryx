export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  this: ThisParameterType<F>,
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
