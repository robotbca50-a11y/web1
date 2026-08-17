import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase not configured. Set env vars in Railway dashboard.");
    return createDummyClient();
  }

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}

// Dummy client so app doesn't crash when Supabase is unavailable
function createDummyClient() {
  const emptyResult = { data: null, error: null, count: null, status: 200, statusText: "OK" };
  const chainable = {
    select: () => chainable,
    insert: () => chainable,
    update: () => chainable,
    delete: () => chainable,
    upsert: () => chainable,
    eq: () => chainable,
    neq: () => chainable,
    gt: () => chainable,
    lt: () => chainable,
    gte: () => chainable,
    lte: () => chainable,
    like: () => chainable,
    ilike: () => chainable,
    is: () => chainable,
    in: () => chainable,
    contains: () => chainable,
    containedBy: () => chainable,
    overlaps: () => chainable,
    order: () => chainable,
    limit: () => chainable,
    range: () => chainable,
    single: () => Promise.resolve(emptyResult),
    maybeSingle: () => Promise.resolve(emptyResult),
    then: (resolve: (v: typeof emptyResult) => void) => resolve(emptyResult),
  };

  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => chainable,
    rpc: () => Promise.resolve(emptyResult),
  } as unknown as ReturnType<typeof createBrowserClient>;
}
