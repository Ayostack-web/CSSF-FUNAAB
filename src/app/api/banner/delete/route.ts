import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';

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

export async function POST(req: Request) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:banner-delete', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const { id, image_url } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing banner id' }, { status: 400 });
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
    const allowedAdminEmail = (process.env.ADMIN_EMAIL || 'ayokunleshittu@gmail.com').toLowerCase();
    const requesterEmail = authData.user?.email?.toLowerCase() || '';

    if (authError || !authData.user || requesterEmail !== allowedAdminEmail) {
      return NextResponse.json({ error: 'Forbidden: admin email required' }, { status: 403 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

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

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
