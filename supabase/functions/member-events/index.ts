
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // In a real implementation, we would query the database here.
    // const { data, error } = await supabase.from('events').select('*')...

    // For now, return mock data to satisfy the frontend and clear the 404
    const events = [
      {
        id: '1',
        title: 'Culto da Família',
        description: 'Venha participar conosco deste momento especial de adoração e comunhão.',
        starts_at: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
        location: 'Templo Sede',
        status: 'published'
      },
      {
        id: '2',
        title: 'Escola Dominical',
        description: 'Aprendizado bíblico para todas as idades.',
        starts_at: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), // +3 days
        location: 'Auditório Principal',
        status: 'published'
      },
      {
        id: '3',
        title: 'Culto de Doutrina',
        description: 'Estudo aprofundado da Palavra de Deus.',
        starts_at: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), // +5 days
        location: 'Templo Sede',
        status: 'published'
      }
    ]

    return new Response(
      JSON.stringify({ data: events }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
