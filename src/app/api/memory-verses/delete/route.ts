import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:memory-verse-delete', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing memory verse id' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { error } = await supabase.from('memory_verses').delete().eq('id', id);

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
