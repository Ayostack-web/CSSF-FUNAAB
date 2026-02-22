import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, image_url, order } = body;

    // 1. Check Environment Variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL' }, 
        { status: 500 }
      );
    }

    // 2. Passkey Validation (Security Layer)
    const expectedPass = process.env.SUPABASE_UPLOAD_PASSKEY || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (expectedPass) {
      const provided = req.headers.get('x-admin-passkey') || '';
      if (provided !== expectedPass) {
        return NextResponse.json({ error: 'Unauthorized: invalid admin passkey' }, { status: 401 });
      }
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