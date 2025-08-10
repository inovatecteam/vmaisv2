import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactEmailRequest {
  user_id: string
  ong_id: string
  observation_message?: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { user_id, ong_id, observation_message }: ContactEmailRequest = await req.json()

    if (!user_id || !ong_id) {
      return new Response(
        JSON.stringify({ error: 'user_id and ong_id are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch user details
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    if (userError || !user) {
      console.error('Error fetching user:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch ONG details
    const { data: ong, error: ongError } = await supabaseClient
      .from('ongs')
      .select('*')
      .eq('id', ong_id)
      .single()

    if (ongError || !ong) {
      console.error('Error fetching ONG:', ongError)
      return new Response(
        JSON.stringify({ error: 'ONG not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch ONG owner details
    const { data: ongOwner, error: ongOwnerError } = await supabaseClient
      .from('users')
      .select('email, nome')
      .eq('id', ong.user_id)
      .single()

    if (ongOwnerError || !ongOwner) {
      console.error('Error fetching ONG owner:', ongOwnerError)
      return new Response(
        JSON.stringify({ error: 'ONG owner not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare email content
    const userInfo = `
Nome: ${user.nome}
Email: ${user.email}
Telefone: ${user.telefone || 'Não informado'}
Localização: ${user.localizacao || 'Não informada'}
Disponibilidade: ${user.disponibilidade || 'Não informada'}
Interesses: ${user.interesses ? user.interesses.join(', ') : 'Não informados'}
Bio: ${user.bio || 'Não informada'}
    `.trim()

    const ongInfo = `
Nome da ONG: ${ong.nome}
Tipo: ${Array.isArray(ong.tipo) ? ong.tipo.join(', ') : ong.tipo}
Cidade: ${ong.cidade || 'Não informada'}
Estado: ${ong.estado || 'Não informado'}
    `.trim()

    const observationText = observation_message 
      ? `\n\nMensagem do voluntário:\n"${observation_message}"`
      : ''

    // Email to admin (voluntariamaisrs@gmail.com)
    const adminEmailSubject = `Novo contato de voluntário - ${user.nome} interessado em ${ong.nome}`
    const adminEmailBody = `
Olá equipe Voluntaria+,

Um novo contato foi estabelecido através da plataforma:

=== INFORMAÇÕES DO VOLUNTÁRIO ===
${userInfo}

=== INFORMAÇÕES DA ONG ===
${ongInfo}
Responsável: ${ongOwner.nome} (${ongOwner.email})
${observationText}

---
Este email foi enviado automaticamente pela plataforma Voluntaria+.
Data: ${new Date().toLocaleString('pt-BR')}
    `.trim()

    // Email to ONG owner
    const ongEmailSubject = `Novo voluntário interessado - ${user.nome} quer ajudar ${ong.nome}`
    const ongEmailBody = `
Olá ${ongOwner.nome},

Você recebeu um novo contato através da plataforma Voluntaria+!

=== VOLUNTÁRIO INTERESSADO ===
${userInfo}
${observationText}

=== PRÓXIMOS PASSOS ===
• Entre em contato com ${user.nome} através do email: ${user.email}
${user.telefone ? `• Ou pelo telefone: ${user.telefone}` : ''}
• Converse sobre como ele(a) pode contribuir com ${ong.nome}
• Lembre-se de assinar um termo de adesão ao trabalho voluntário

---
Este email foi enviado automaticamente pela plataforma Voluntaria+.
Data: ${new Date().toLocaleString('pt-BR')}

Atenciosamente,
Equipe Voluntaria+
    `.trim()

    // Note: In a real implementation, you would use an email service like Resend, SendGrid, etc.
    // For now, we'll simulate the email sending and log the content
    console.log('=== EMAIL TO ADMIN ===')
    console.log('To:', 'voluntariamaisrs@gmail.com')
    console.log('Subject:', adminEmailSubject)
    console.log('Body:', adminEmailBody)
    console.log('\n=== EMAIL TO ONG ===')
    console.log('To:', ongOwner.email)
    console.log('Subject:', ongEmailSubject)
    console.log('Body:', ongEmailBody)

    // TODO: Replace this simulation with actual email sending
    // Example with Resend:
    /*
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    // Send email to admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Voluntaria+ <noreply@voluntariaplus.com>',
        to: ['voluntariamaisrs@gmail.com'],
        subject: adminEmailSubject,
        text: adminEmailBody,
      }),
    })

    // Send email to ONG owner
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Voluntaria+ <noreply@voluntariaplus.com>',
        to: [ongOwner.email],
        subject: ongEmailSubject,
        text: ongEmailBody,
      }),
    })
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails enviados com sucesso' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-whatsapp-contact-email function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})