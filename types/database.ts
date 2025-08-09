export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          nome: string
          tipo: 'voluntario' | 'ong'
          email: string
          telefone: string | null
          foto: string | null
          bio: string | null
          interesses: string[] | null
          disponibilidade: string | null
          localizacao: string | null
          onboarded: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
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
          onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo?: 'voluntario' | 'ong'
          email?: string
          telefone?: string | null
          foto?: string | null
          bio?: string | null
          interesses?: string[] | null
          disponibilidade?: string | null
          localizacao?: string | null
          onboarded?: boolean
          updated_at?: string
        }
      }
      ongs: {
        Row: {
          id: string
          user_id: string
          nome: string
          tipo: string[]
          descricao: string
          short_description: string | null
          how_to_help: string | null
          additional_categories: string[] | null
          cidade: string | null
          estado: string | null
          localizacao_tipo: 'presencial' | 'online' | 'ambos' | null
          endereco_online: string[] | null
          necessidades: string[] | null
          whatsapp: string | null
          thumbnail_url: string | null
          lat: number | null
          lng: number | null
          horarios_funcionamento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          tipo: string[]
          descricao: string
          short_description?: string | null
          how_to_help?: string | null
          additional_categories?: string[] | null
          cidade?: string | null
          estado?: string | null
          localizacao_tipo?: 'presencial' | 'online' | 'ambos' | null
          endereco_online?: string[] | null
          necessidades?: string[] | null
          whatsapp?: string | null
          thumbnail_url?: string | null
          lat?: number | null
          lng?: number | null
          horarios_funcionamento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          tipo?: string[]
          descricao?: string
          short_description?: string | null
          how_to_help?: string | null
          additional_categories?: string[] | null
          cidade?: string | null
          estado?: string | null
          localizacao_tipo?: 'presencial' | 'online' | 'ambos' | null
          endereco_online?: string[] | null
          necessidades?: string[] | null
          whatsapp?: string | null
          thumbnail_url?: string | null
          lat?: number | null
          lng?: number | null
          horarios_funcionamento?: string | null
          updated_at?: string
        }
      }
      ongs: {
        Row: {
          id: string
          user_id: string
          nome: string
          tipo: string[]
          descricao: string
          short_description: string | null
          how_to_help: string | null
          additional_categories: string[] | null
          cidade: string | null
          estado: string | null
          localizacao_tipo: 'presencial' | 'online' | 'ambos' | null
          endereco_online: string[] | null
          necessidades: string[] | null
          whatsapp: string | null
          thumbnail_url: string | null
          lat: number | null
          lng: number | null
          horarios_funcionamento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          tipo: string[]
          descricao: string
          short_description?: string | null
          how_to_help?: string | null
          additional_categories?: string[] | null
          cidade?: string | null
          estado?: string | null
          localizacao_tipo?: 'presencial' | 'online' | 'ambos' | null
          endereco_online?: string[] | null
          necessidades?: string[] | null
          whatsapp?: string | null
          thumbnail_url?: string | null
          lat?: number | null
          lng?: number | null
          horarios_funcionamento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          tipo?: string[]
          descricao?: string
          short_description?: string | null
          how_to_help?: string | null
          additional_categories?: string[] | null
          cidade?: string | null
          estado?: string | null
          localizacao_tipo?: 'presencial' | 'online' | 'ambos' | null
          endereco_online?: string[] | null
          necessidades?: string[] | null
          whatsapp?: string | null
          thumbnail_url?: string | null
          lat?: number | null
          lng?: number | null
          horarios_funcionamento?: string | null
          updated_at?: string
        }
      }
      interacoes: {
        Row: {
          id: string
          user_id: string
          ong_id: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          ong_id: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          ong_id?: string
          timestamp?: string
        }
      }
      tarefas: {
        Row: {
          id: string
          user_id: string
          titulo: string
          descricao: string | null
          status: 'pendente' | 'em_andamento' | 'concluida'
          data: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          titulo: string
          descricao?: string | null
          status?: 'pendente' | 'em_andamento' | 'concluida'
          data: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          titulo?: string
          descricao?: string | null
          status?: 'pendente' | 'em_andamento' | 'concluida'
          data?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}