import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, image_url } = body

    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Delete from Database
    const { error: dbError } = await supabase
      .from('worship_sermons')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    // 2. Delete from Storage if URL exists
    if (image_url) {
      // Extract filename from the URL
      const fileName = image_url.split('/').pop()
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('worship-images')
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