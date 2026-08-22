import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("[SUPABASE] DUMMY CLIENT — env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment dashboard AND redeploy.");
    return createDummyClient();
  }

  if (!client) {
    console.log("[SUPABASE] Real client connecting to:", url);
    client = createBrowserClient(url, key);
  }
  return client;
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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

  function createDummyChannel() {
    const broadcastHandlers: Record<string, Function[]> = {};
    const presenceHandlers: Record<string, Function[]> = {};
    return {
      on: (type: string, filter: { event: string } | Function, callback?: Function) => {
        const evt = typeof filter === "function" ? "*" : filter.event;
        const cb = typeof filter === "function" ? filter : callback;
        if (type === "broadcast" && cb) {
          if (!broadcastHandlers[evt]) broadcastHandlers[evt] = [];
          broadcastHandlers[evt].push(cb);
        } else if (type === "presence" && cb) {
          if (!presenceHandlers[evt]) presenceHandlers[evt] = [];
          presenceHandlers[evt].push(cb);
        }
        return createDummyChannel();
      },
      send: async (_payload: unknown) => ({ error: null }),
      track: async (_state: unknown) => ({ error: null }),
      unsubscribe: () => {},
      subscribe: (callback?: (status: string) => void) => {
        if (callback) setTimeout(() => callback("SUBSCRIBED"), 10);
        return { error: null };
      },
      presenceState: () => ({} as Record<string, unknown[]>),
      leave: async () => ({ error: null }),
    };
  }

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
    channel: (_name: string, _opts?: unknown) => createDummyChannel(),
    removeChannel: () => Promise.resolve({ error: null }),
    removeAllChannels: () => Promise.resolve({ error: null }),
  } as unknown as ReturnType<typeof createBrowserClient>;
}
