import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:banner-upload', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const { event_name, image_url, eventDate, eventTime } = await req.json();

    if (!image_url) {
      return NextResponse.json({ error: 'Missing image_url' }, { status: 400 });
    }

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const normalizedEventName = typeof event_name === 'string' && event_name.trim() ? event_name.trim() : null;
    const normalizedEventDate = typeof eventDate === 'string' && eventDate.trim() ? eventDate : null;
    const normalizedEventTime = typeof eventTime === 'string' && eventTime.trim() ? eventTime : null;

    const { error } = await supabase
      .from('banners')
      .insert([{ event_name: normalizedEventName, image_url, event_date: normalizedEventDate, event_time: normalizedEventTime }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
