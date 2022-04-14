export const wait = async (t: number): Promise<void> =>
  await new Promise((r) => setTimeout(r, t));
