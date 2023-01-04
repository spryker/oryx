export const wait = async (milliseconds?: number): Promise<void> =>
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds ?? 0);
  });
