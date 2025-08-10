import { supabase } from './supabase'

export interface ContactEmailData {
  user_id: string
  ong_id: string
  observation_message?: string
}

export const sendContactEmail = async (data: ContactEmailData): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('send-whatsapp-contact-email', {
      body: data
    })

    if (error) {
      console.error('Erro ao enviar email de contato:', error)
      throw new Error(error.message || 'Erro ao enviar email de contato')
    }
  } catch (error: any) {
    console.error('Erro na chamada da função:', error)
    throw new Error(error.message || 'Erro ao processar solicitação de contato')
  }
}