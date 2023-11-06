export const get = async <R>(url: string): Promise<R> => {
  const response = await window.fetch(url);
  const data = await response.json();
  if (response.ok) {
    return data;
  }

  throw new Error(data.message);
};
