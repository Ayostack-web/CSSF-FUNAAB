import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const SETTINGS_KEY_PRIMARY = 'footer_phone';
const SETTINGS_KEY_SECONDARY = 'footer_phone_secondary';

async function getSettingValue(supabase: SupabaseClient, key: string) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  return { value: data?.value || '', error };
}

async function upsertSettingValue(
  supabase: SupabaseClient,
  key: string,
  value: string
) {
  const { data: existing, error: existingError } = await supabase
    .from('site_settings')
    .select('id')
    .eq('key', key)
    .maybeSingle();

  if (existingError) return { error: existingError };

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('id', existing.id);

    return { error: updateError };
  }

  const { error: insertError } = await supabase
    .from('site_settings')
    .insert([{ key, value }]);

  return { error: insertError };
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, anonKey, serviceKey };
}

export async function GET() {
  try {
    const { supabaseUrl, serviceKey } = getSupabaseConfig();

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured', footerPhone: '' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const [{ value: footerPhone, error: primaryError }, { value: footerPhoneSecondary, error: secondaryError }] = await Promise.all([
      getSettingValue(supabase, SETTINGS_KEY_PRIMARY),
      getSettingValue(supabase, SETTINGS_KEY_SECONDARY),
    ]);

    if (primaryError || secondaryError) {
      const error = primaryError || secondaryError;
      return NextResponse.json({ error: error?.message || 'Failed to load settings', footerPhone: '', footerPhoneSecondary: '' }, { status: 500 });
    }

    return NextResponse.json({
      footerPhone,
      footerPhoneSecondary,
      footerPhones: [footerPhone, footerPhoneSecondary].filter(Boolean),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message, footerPhone: '', footerPhoneSecondary: '', footerPhones: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:footer-phone-update', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const { footerPhone = '', footerPhoneSecondary = '' } = await req.json();

    if (!footerPhone && !footerPhoneSecondary) {
      return NextResponse.json({ error: 'At least one phone number is required' }, { status: 400 });
    }

    const { supabaseUrl, anonKey, serviceKey } = getSupabaseConfig();

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing Supabase env vars' },
        { status: 500 }
      );
    }

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: missing access token' }, { status: 401 });
    }

    const authClient = createClient(supabaseUrl, anonKey);
    const { data: authData, error: authError } = await authClient.auth.getUser(token);

    const allowedAdminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      'ayokunleshittu@gmail.com'
    ).toLowerCase();
    const requesterEmail = authData.user?.email?.toLowerCase() || '';

    if (authError || !authData.user || requesterEmail !== allowedAdminEmail) {
      return NextResponse.json({ error: 'Forbidden: admin email required' }, { status: 403 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const [{ error: primaryWriteError }, { error: secondaryWriteError }] = await Promise.all([
      upsertSettingValue(supabase, SETTINGS_KEY_PRIMARY, footerPhone),
      upsertSettingValue(supabase, SETTINGS_KEY_SECONDARY, footerPhoneSecondary),
    ]);

    if (primaryWriteError || secondaryWriteError) {
      const error = primaryWriteError || secondaryWriteError;
      return NextResponse.json({ error: error?.message || 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      footerPhone,
      footerPhoneSecondary,
      footerPhones: [footerPhone, footerPhoneSecondary].filter(Boolean),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
