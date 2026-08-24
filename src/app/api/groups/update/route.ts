import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:groups-update', 40, 60_000);
    if (rateLimitError) return rateLimitError;

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const body = await req.json();
    const id = typeof body.id === 'string' ? body.id : '';
    if (!id) {
      return NextResponse.json({ error: 'Missing group id' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (typeof body.name === 'string') {
      const name = body.name.trim();
      if (!name || name.length > 80) {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
      }
      updates.name = name;
    }
    if (typeof body.about === 'string') {
      const about = body.about.trim();
      if (!about || about.length > 500) {
        return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
      }
      updates.about = about;
    }
    if (typeof body.link === 'string') {
      const link = body.link.trim();
      if (link.length > 300) {
        return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
      }
      updates.link = link || null;
    }
    if (typeof body.image_url === 'string' && body.image_url.trim()) {
      updates.image = body.image_url.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { error } = await supabase.from('groups').update(updates).eq('id', id);
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
