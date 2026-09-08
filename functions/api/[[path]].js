export async function onRequest(context) {
  const url = new URL(context.request.url);

  const target =
    "https://flowly-v2-production-production.up.railway.app" +
    url.pathname +
    url.search;

  const headers = new Headers(context.request.headers);
  headers.delete("host");

  const upstream = await fetch(target, {
    method: context.request.method,
    headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : context.request.body,
    redirect: "manual"
  });

  const responseHeaders = new Headers(upstream.headers);

  const setCookie = upstream.headers.get("set-cookie");

  if (setCookie) {
    responseHeaders.delete("set-cookie");

    responseHeaders.append(
      "set-cookie",
      setCookie.replace(/;\s*Domain=[^;]+/gi, "")
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders
  });
}