import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, createAdminClient } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:worship-delete', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const body = await req.json();
    const { id, image_url } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing worship image id' }, { status: 400 });
    }

    const authCheck = await requireAdmin(req);
    if (!authCheck.ok) return authCheck.response;

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { error: dbError } = await supabase
      .from('worship_images')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    if (image_url) {
      const fileName = image_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('worship_images')
          .remove([fileName]);

        if (storageError) console.error('Storage deletion error:', storageError);
      }
    }

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Deletion failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
