import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const SETTINGS_KEY = 'footer_phone';

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

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message, footerPhone: '' }, { status: 500 });
    }

    return NextResponse.json({ footerPhone: data?.value || '' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message, footerPhone: '' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { footerPhone = '' } = await req.json();

    if (!footerPhone) {
      return NextResponse.json({ error: 'Missing footerPhone' }, { status: 400 });
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

    const allowedAdminEmail = (process.env.ADMIN_EMAIL || 'ayokunleshittu@gmail.com').toLowerCase();
    const requesterEmail = authData.user?.email?.toLowerCase() || '';

    if (authError || !authData.user || requesterEmail !== allowedAdminEmail) {
      return NextResponse.json({ error: 'Forbidden: admin email required' }, { status: 403 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: existing, error: existingError } = await supabase
      .from('site_settings')
      .select('id')
      .eq('key', SETTINGS_KEY)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ value: footerPhone })
        .eq('id', existing.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert([{ key: SETTINGS_KEY, value: footerPhone }]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, footerPhone });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
