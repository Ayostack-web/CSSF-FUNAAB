import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    return imageUrl.split('/').pop()?.split('?')[0] || '';
  }
}

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_URL' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = data || [];
    const signedRows = await Promise.all(
      rows.map(async (item) => {
        const imageUrl = item?.image_url || '';
        const filePath = getStoragePathFromUrl(imageUrl);
        if (!filePath) return item;

        const { data: signed } = await supabase.storage
          .from('event-banners')
          .createSignedUrl(filePath, 60 * 60);

        return { ...item, image_url: signed?.signedUrl || imageUrl };
      })
    );

    return NextResponse.json({ banners: signedRows }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
