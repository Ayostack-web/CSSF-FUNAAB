import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:sermon-upload', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const { title, drive_link } = await req.json();

    if (!title || !drive_link) {
      return NextResponse.json({ error: 'Please provide both a title and a link.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { error } = await supabase
      .from('sermons')
      .insert([{ title: String(title).trim(), drive_link: String(drive_link).trim() }]);

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
