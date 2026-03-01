// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { errBody, ERR } from '../_shared/error.ts'

interface EmailPayload {
  contact_value: string;
  protocol: string;
  category: string;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get origin for CORS validation
  const origin = req.headers.get('origin');

  try {
    const { contact_value, protocol, category } = await req.json() as EmailPayload;

    console.log(`[Prayer Confirmation] Sending email to: ${contact_value}`);
    console.log(`[Prayer Confirmation] Protocol: ${protocol}, Category: ${category}`);

    // Mock response
    return jsonResponse({ message: "Email queued (mock)", protocol }, 200, origin)
  } catch (error: any) {
    console.error('[prayer-confirmation] Error:', error)
    return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin)
  }
})
