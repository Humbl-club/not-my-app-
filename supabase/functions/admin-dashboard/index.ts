import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AdminRequest {
  action: string
  data?: any
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify admin authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify user is admin (require authenticated user)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin (match by email as maintained in admin_users)
    const { data: adminUser, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('role')
      .eq('email', user.email)
      .single()

    if (adminError || !adminUser) {
      throw new Error('Not an admin user')
    }

    // Get request body
    const { action, data }: AdminRequest = await req.json()

    let response: any = {}

    switch (action) {
      case 'GET_STATS':
        // Get application statistics
        const { data: stats } = await supabaseClient.rpc(
          'get_application_stats',
          {
            date_from: data?.dateFrom,
            date_to: data?.dateTo
          }
        )
        response = { stats }
        break

      case 'GET_APPLICATIONS':
        // Get paginated applications
        const page = data?.page || 1
        const limit = data?.limit || 10
        const from = (page - 1) * limit
        const to = from + limit - 1

        const query = supabaseClient
          .from('application_overview')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to)

        // Apply filters
        if (data?.status) {
          query.eq('status', data.status)
        }
        if (data?.paymentStatus) {
          query.eq('payment_status', data.paymentStatus)
        }
        if (data?.search) {
          query.or(`reference_number.ilike.%${data.search}%,user_email.ilike.%${data.search}%`)
        }

        const { data: applications, error, count } = await query

        response = {
          applications,
          total: count,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }
        break

      case 'GET_APPLICATION_DETAIL':
        // Get detailed application information
        const { data: application } = await supabaseClient
          .from('applications')
          .select(`
            *,
            applicants (
              *,
              documents (*)
            ),
            payment_transactions (*),
            audit_logs (*)
          `)
          .eq('id', data.applicationId)
          .single()

        response = { application }
        break

      case 'UPDATE_APPLICATION_STATUS':
        // Update application status
        const { error: updateError } = await supabaseClient
          .from('applications')
          .update({
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.applicationId)

        if (updateError) throw updateError

        // Create audit log
        await supabaseClient
          .from('audit_logs')
          .insert({
            application_id: data.applicationId,
            user_id: user.id,
            action: `STATUS_CHANGED_TO_${data.status.toUpperCase()}`,
            details: {
              old_status: data.oldStatus,
              new_status: data.status,
              reason: data.reason
            }
          })

        response = { success: true }
        break

      case 'VERIFY_DOCUMENT':
        // Manually verify a document
        const { error: verifyError } = await supabaseClient
          .from('documents')
          .update({
            verification_status: data.status,
            validated_by: user.id,
            validated_at: new Date().toISOString(),
            validation_details: data.details || {}
          })
          .eq('id', data.documentId)

        if (verifyError) throw verifyError

        response = { success: true }
        break

      case 'GET_AUDIT_LOGS':
        // Get audit logs for an application
        const { data: logs } = await supabaseClient
          .from('audit_logs')
          .select('*')
          .eq('application_id', data.applicationId)
          .order('created_at', { ascending: false })
          .limit(data.limit || 50)

        response = { logs }
        break

      case 'EXPORT_DATA':
        // Export application data
        const exportQuery = supabaseClient
          .from('applications')
          .select(`
            reference_number,
            status,
            payment_status,
            created_at,
            submitted_at,
            user_email,
            payment_amount,
            applicants (
              first_name,
              last_name,
              passport_number,
              nationality,
              date_of_birth
            )
          `)

        // Apply date range filter
        if (data?.dateFrom) {
          exportQuery.gte('created_at', data.dateFrom)
        }
        if (data?.dateTo) {
          exportQuery.lte('created_at', data.dateTo)
        }

        const { data: exportData } = await exportQuery

        response = {
          data: exportData,
          count: exportData?.length || 0
        }
        break

      case 'DASHBOARD_METRICS':
        // Get dashboard metrics
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const thisWeek = new Date(today)
        thisWeek.setDate(today.getDate() - 7)
        const thisMonth = new Date(today)
        thisMonth.setMonth(today.getMonth() - 1)

        // Get various metrics
        const [todayStats, weekStats, monthStats] = await Promise.all([
          supabaseClient.rpc('get_application_stats', {
            date_from: today.toISOString(),
            date_to: now.toISOString()
          }),
          supabaseClient.rpc('get_application_stats', {
            date_from: thisWeek.toISOString(),
            date_to: now.toISOString()
          }),
          supabaseClient.rpc('get_application_stats', {
            date_from: thisMonth.toISOString(),
            date_to: now.toISOString()
          })
        ])

        // Get pending reviews
        const { count: pendingReviews } = await supabaseClient
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'submitted')

        // Get recent applications
        const { data: recentApplications } = await supabaseClient
          .from('application_overview')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        response = {
          today: todayStats.data,
          week: weekStats.data,
          month: monthStats.data,
          pendingReviews,
          recentApplications
        }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    // Log admin action
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: `ADMIN_${action}`,
        details: {
          request_data: data,
        admin_role: adminUser.role
      },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      })

    return new Response(
      JSON.stringify({
        success: true,
        ...response
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Admin dashboard error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Admin operation failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400
      }
    )
  }
})
