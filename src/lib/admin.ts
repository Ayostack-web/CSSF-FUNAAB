import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_ADMIN_EMAIL = 'cssf.funaab@ayostack.dev';

export function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, anonKey, serviceKey };
}

export function getAdminEmail() {
  return (
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    DEFAULT_ADMIN_EMAIL
  ).toLowerCase();
}

export function createAdminClient(): SupabaseClient | null {
  const { supabaseUrl, serviceKey } = getSupabaseConfig();
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey);
}

export async function requireAdmin(request: NextRequest) {
  const { supabaseUrl, anonKey } = getSupabaseConfig();
  if (!supabaseUrl || !anonKey) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Server misconfigured' }, { status: 500 }),
    };
  }

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Unauthorized: missing access token' }, { status: 401 }),
    };
  }

  const authClient = createClient(supabaseUrl, anonKey);
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  const requesterEmail = authData.user?.email?.toLowerCase() || '';

  if (authError || !authData.user || requesterEmail !== getAdminEmail()) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Forbidden: admin email required' }, { status: 403 }),
    };
  }

  return { ok: true as const };
}
