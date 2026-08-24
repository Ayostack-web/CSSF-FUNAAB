import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:groups-add', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const about = typeof body.about === 'string' ? body.about.trim() : '';
    const image = typeof body.image_url === 'string' ? body.image_url.trim() : '';
    const link = typeof body.link === 'string' ? body.link.trim() : '';

    if (!name || name.length > 80 || !about || about.length > 500 || link.length > 300) {
      return NextResponse.json({ error: 'Invalid group fields' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { data: maxRow } = await supabase
      .from('groups')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await supabase.from('groups').insert({
      name,
      about,
      image,
      link: link || null,
      sort_order: (maxRow?.sort_order ?? 0) + 1,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
