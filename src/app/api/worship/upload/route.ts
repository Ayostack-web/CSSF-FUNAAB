import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:worship-upload', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const body = await req.json();
    const { title, image_url, order } = body;

    // 1. Check Environment Variables
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

    // 3. Initialize Supabase Admin Client
    const supabase = createClient(supabaseUrl, serviceKey);

    // 4. Insert into Database Table
    const { error: dbError } = await supabase
      .from('worship_images')
      .insert([{ title, image_url, order: order || 0 }]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    // Standardizing the error message for TypeScript/Vercel
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}