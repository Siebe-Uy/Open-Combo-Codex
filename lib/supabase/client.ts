"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

let client: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured() {
  return hasSupabaseEnv();
}

export function createClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  if (!client) {
    const { url, key } = getSupabaseEnv();
    client = createBrowserClient<Database>(url, key);
  }

  return client;
}
