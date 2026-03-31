import { supabase } from './supabase'

export interface ContactEmailData {
  user_id: string
  ong_id: string
  observation_message?: string
}

export const sendContactEmail = async (data: ContactEmailData): Promise<void> => {
  const maxRetries = 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { error } = await supabase.functions.invoke('send-whatsapp-contact-email', {
        body: data
      })

      if (error) {
        throw new Error(error.message || 'Erro ao enviar email de contato')
      }

      return // success
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Erro ao processar solicitação de contato')

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError
}
