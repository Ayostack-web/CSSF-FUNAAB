import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:banner-upload', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const { event_name, image_url, eventDate, eventTime } = await req.json();

    if (!image_url) {
      return NextResponse.json({ error: 'Missing image_url' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_URL' },
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
    const normalizedEventName = typeof event_name === 'string' && event_name.trim() ? event_name.trim() : null;
    const normalizedEventDate = typeof eventDate === 'string' && eventDate.trim() ? eventDate : null;
    const normalizedEventTime = typeof eventTime === 'string' && eventTime.trim() ? eventTime : null;

    const { error } = await supabase
      .from('banners')
      .insert([{ event_name: normalizedEventName, image_url, event_date: normalizedEventDate, event_time: normalizedEventTime }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
