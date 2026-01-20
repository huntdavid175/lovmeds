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
  if (!ENDPOINT) {
    console.error("WORDPRESS_ENDPOINT is not set. Check your .env.local file.");
    throw new Error("WORDPRESS_ENDPOINT is not set");
  }
  
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      // Caching control: default ISR 3600s (1 hour), overridable per call
      next: { revalidate: options?.revalidate ?? 3600 },
      cache: options?.cache,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unable to read error response");
      console.error(
        `GraphQL fetch failed: ${res.status} ${res.statusText}\nEndpoint: ${ENDPOINT}\nError: ${errorText}`
      );
      throw new Error(`GraphQL HTTP error ${res.status}: ${errorText}`);
    }
    
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors?.length) {
      console.error("GraphQL errors:", json.errors);
      throw new Error(json.errors.map((e) => e.message).join("\n"));
    }
    return json.data as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error(
        `Network error fetching from WordPress:\nEndpoint: ${ENDPOINT}\nError: ${error.message}\nHint: Check if the endpoint URL is correct and accessible. For local domains like 'drugshop.local', ensure it's in your /etc/hosts file and the server is running.`
      );
    }
    throw error;
  }
}
