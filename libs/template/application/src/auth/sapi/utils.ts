export function parseToken<Payload>(token: string): Payload {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = JSON.parse(
    decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  );
  const parsedSub = JSON.parse(jsonPayload.sub);

  return {
    ...jsonPayload,
    sub: parsedSub,
  };
}
