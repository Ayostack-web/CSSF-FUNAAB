import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, image_url } = body

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL' }, { status: 500 })
    }

    // Basic server-side passkey protection
    const expectedPass = process.env.SUPABASE_UPLOAD_PASSKEY || process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (expectedPass) {
      const provided = req.headers.get('x-admin-passkey') || ''
      if (provided !== expectedPass) {
        return NextResponse.json({ error: 'Unauthorized: invalid admin passkey' }, { status: 401 })
      }
    }

    const supabase = createClient(supabaseUrl, serviceKey)

    // If an image_url was provided, try to remove the file from storage
    if (image_url) {
      try {
        const parts = image_url.split('/')
        const fileNameWithQuery = parts[parts.length - 1]
        const fileName = fileNameWithQuery.split('?')[0]
        if (fileName) {
          await supabase.storage.from('worship_images').remove([fileName])
        }
      } catch (err) {
        // ignore storage removal errors, proceed to delete DB row
      }
    }

    const { error } = await supabase.from('worship_images').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
