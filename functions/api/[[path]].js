export async function onRequest(context) {
  const url = new URL(context.request.url);

  const target =
    "https://flowly-v2-production-production.up.railway.app" +
    url.pathname +
    url.search;

  const headers = new Headers(context.request.headers);
  headers.delete("host");

  const request = new Request(target, {
    method: context.request.method,
    headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : context.request.body,
    redirect: "manual"
  });

  return fetch(request);
}