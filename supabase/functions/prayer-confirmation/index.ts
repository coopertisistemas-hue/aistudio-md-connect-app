// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailPayload {
  contact_value: string;
  protocol: string;
  category: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contact_value, protocol, category } = await req.json() as EmailPayload;

    console.log(`[Prayer Confirmation] Sending email to: ${contact_value}`);
    console.log(`[Prayer Confirmation] Protocol: ${protocol}, Category: ${category}`);

    // Mock response
    return new Response(
      JSON.stringify({ message: "Email queued (mock)", protocol }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})
