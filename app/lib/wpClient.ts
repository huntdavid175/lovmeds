export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const ENDPOINT = process.env.WORDPRESS_ENDPOINT as string;

export async function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { revalidate?: number | false; cache?: RequestCache }
) {
  if (!ENDPOINT) throw new Error("WORDPRESS_ENDPOINT is not set");
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // Caching control: default ISR 60s, overridable per call
    next: { revalidate: options?.revalidate ?? 60 },
    cache: options?.cache,
  });

  if (!res.ok) throw new Error(`GraphQL HTTP error ${res.status}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length)
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  return json.data as T;
}
