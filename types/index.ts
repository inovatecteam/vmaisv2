export type User = {
  id: string
  nome: string
  tipo: 'voluntario' | 'ong'
  email: string
  telefone?: string | null
  foto?: string | null
  bio?: string | null
  interesses?: string[] | null
  disponibilidade?: string | null
  localizacao?: string | null
  onboarded: boolean
  created_at: string
  updated_at: string
}

export type ONG = {
  id: string
  user_id: string
  nome: string
  tipo: string[]
  descricao: string
  short_description?: string | null
  how_to_help?: string | null
  localizacao_tipo?: 'presencial' | 'online' | 'ambos' | 'itinerante' | null
  endereco_online?: string[] | null
  necessidades?: string[] | null
  whatsapp?: string | null
  endereco_fisico?: string | null
  doacoes?: string | null
  thumbnail_url?: string | null
  admin_approved: boolean
  lat?: number | null
  lng?: number | null
  created_at: string
  updated_at: string
}

export type Interacao = {
  id: string
  user_id: string
  ong_id: string
  timestamp: string
}
