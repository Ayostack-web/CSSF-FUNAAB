import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

function getStoragePathFromUrl(imageUrl: string) {
  try {
    const parsed = new URL(imageUrl);
    const marker = '/group_images/';
    const idx = parsed.pathname.indexOf(marker);
    if (idx !== -1) {
      return decodeURIComponent(parsed.pathname.slice(idx + marker.length));
    }
    return '';
  } catch {
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:groups-delete', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const body = await req.json();
    const id = typeof body.id === 'string' ? body.id : '';
    if (!id) {
      return NextResponse.json({ error: 'Missing group id' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { error: dbError } = await supabase.from('groups').delete().eq('id', id);
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const imageUrl = typeof body.image_url === 'string' ? body.image_url : '';
    const filePath = imageUrl ? getStoragePathFromUrl(imageUrl) : '';
    if (filePath) {
      await supabase.storage.from('group_images').remove([filePath]);
    }

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
