import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getRateLimitErrorResponse } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const rateLimitError = getRateLimitErrorResponse(req, 'api:worship-delete', 20, 60_000)
    if (rateLimitError) return rateLimitError

    const body = await req.json()
    const { id, image_url } = body

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !anonKey || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_URL' },
        { status: 500 }
      )
    }

    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: missing access token' }, { status: 401 })
    }

    const authClient = createClient(supabaseUrl, anonKey)
    const { data: authData, error: authError } = await authClient.auth.getUser(token)
    const allowedAdminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      'ayokunleshittu@gmail.com'
    ).toLowerCase()
    const requesterEmail = authData.user?.email?.toLowerCase() || ''
    if (authError || !authData.user || requesterEmail !== allowedAdminEmail) {
      return NextResponse.json({ error: 'Forbidden: admin email required' }, { status: 403 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Delete from Database
    const { error: dbError } = await supabase
      .from('worship_images')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    // 2. Delete from Storage if URL exists
    if (image_url) {
      // Extract filename from the URL
      const fileName = image_url.split('/').pop()
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('worship_images')
          .remove([fileName])
        
        if (storageError) console.error('Storage deletion error:', storageError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Delete error:', error)
    // Fix for line 51: Use a type guard for the 'unknown' error type
    const errorMessage = error instanceof Error ? error.message : "Deletion failed"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}