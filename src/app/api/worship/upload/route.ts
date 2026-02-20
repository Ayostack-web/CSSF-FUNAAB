import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, image_url, order } = body

    // Require service role key in server env to perform inserts that RLS would block
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL' }, { status: 500 })
    }

    // Basic server-side passkey protection: accept either SUPABASE_UPLOAD_PASSKEY or NEXT_PUBLIC_ADMIN_PASSWORD
    const expectedPass = process.env.SUPABASE_UPLOAD_PASSKEY || process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (expectedPass) {
      const provided = req.headers.get('x-admin-passkey') || ''
      if (provided !== expectedPass) {
        return NextResponse.json({ error: 'Unauthorized: invalid admin passkey' }, { status: 401 })
      }
    }

    const supabase = createClient(supabaseUrl, serviceKey)

    const { error } = await supabase.from('worship_images').insert([{ title, image_url, order }])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
