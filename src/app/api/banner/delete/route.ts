import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

function getStoragePathFromUrl(imageUrl: string) {
  try {
    const parsed = new URL(imageUrl);
    const marker = '/event-banners/';
    const idx = parsed.pathname.indexOf(marker);
    if (idx !== -1) {
      return decodeURIComponent(parsed.pathname.slice(idx + marker.length));
    }
    const fallback = parsed.pathname.split('/').pop() || '';
    return decodeURIComponent(fallback);
  } catch {
    return imageUrl.split('/').pop() || '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:banner-delete', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const { id, image_url } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing banner id' }, { status: 400 });
    }

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { error: dbError } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (image_url) {
      const filePath = getStoragePathFromUrl(image_url);
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('event-banners')
          .remove([filePath]);

        if (storageError) {
          console.error('Banner storage deletion error:', storageError);
        }
      }
    }

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
