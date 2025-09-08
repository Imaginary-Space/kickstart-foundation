import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CleanupStats {
  photosDeleted: number
  storageFreed: number
  errors: string[]
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const stats: CleanupStats = {
    photosDeleted: 0,
    storageFreed: 0,
    errors: []
  }

  try {
    console.log('Starting cleanup of large photos (>5MB)')
    
    // Find photos larger than 5MB (5,242,880 bytes)
    const { data: largePhotos, error: queryError } = await supabase
      .from('photos')
      .select('id, file_path, file_size, user_id')
      .gt('file_size', 5242880)
      .limit(50) // Process in batches to avoid performance issues

    if (queryError) {
      console.error('Error querying large photos:', queryError)
      stats.errors.push(`Query error: ${queryError.message}`)
      return new Response(JSON.stringify(stats), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!largePhotos || largePhotos.length === 0) {
      console.log('No large photos found for cleanup')
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Found ${largePhotos.length} photos to delete`)

    // Process each photo
    for (const photo of largePhotos) {
      try {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('user-photos')
          .remove([photo.file_path])

        if (storageError) {
          console.error(`Storage deletion error for ${photo.file_path}:`, storageError)
          stats.errors.push(`Storage error for ${photo.file_path}: ${storageError.message}`)
          continue
        }

        // Delete from database
        const { error: dbError } = await supabase
          .from('photos')
          .delete()
          .eq('id', photo.id)

        if (dbError) {
          console.error(`Database deletion error for photo ${photo.id}:`, dbError)
          stats.errors.push(`Database error for photo ${photo.id}: ${dbError.message}`)
          continue
        }

        // Update stats
        stats.photosDeleted++
        stats.storageFreed += photo.file_size
        
        console.log(`Successfully deleted photo ${photo.id} (${(photo.file_size / 1024 / 1024).toFixed(2)}MB)`)

      } catch (error) {
        const errorMsg = `Unexpected error processing photo ${photo.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(errorMsg)
        stats.errors.push(errorMsg)
      }
    }

    // Log cleanup activity
    if (stats.photosDeleted > 0 || stats.errors.length > 0) {
      await supabase.from('error_logs').insert({
        operation: 'cleanup-large-photos',
        error_type: 'system_info',
        severity: stats.errors.length > 0 ? 'medium' : 'low',
        error_message: `Cleanup completed: ${stats.photosDeleted} photos deleted, ${(stats.storageFreed / 1024 / 1024).toFixed(2)}MB freed`,
        error_details: {
          stats,
          timestamp: new Date().toISOString()
        }
      })
    }

    console.log(`Cleanup completed: ${stats.photosDeleted} photos deleted, ${(stats.storageFreed / 1024 / 1024).toFixed(2)}MB freed`)
    
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    const errorMsg = `Fatal error in cleanup process: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error(errorMsg)
    
    // Log the fatal error
    try {
      await supabase.from('error_logs').insert({
        operation: 'cleanup-large-photos',
        error_type: 'system_error',
        severity: 'high',
        error_message: errorMsg,
        error_details: { error: error instanceof Error ? error.stack : error }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    stats.errors.push(errorMsg)
    
    return new Response(JSON.stringify(stats), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})