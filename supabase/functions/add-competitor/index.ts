import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { url } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Relaying request to n8n webhook:', { url })

    // Forward the request to the n8n webhook
    const response = await fetch('https://n8n.srv802543.hstgr.cloud/webhook-test/ajout-concurrent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    console.log('N8N webhook response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (response.ok) {
      const responseData = await response.text()
      console.log('N8N webhook response data:', responseData)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Competitor added successfully',
          data: responseData 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      const errorText = await response.text()
      console.error('N8N webhook error:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to add competitor to n8n webhook',
          details: errorText,
          status: response.status
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Error in add-competitor function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})