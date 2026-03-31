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
        Relationships: []
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
          localizacao_tipo: 'presencial' | 'online' | 'ambos' | 'itinerante' | null
          endereco_online: string[] | null
          necessidades: string[] | null
          whatsapp: string | null
          endereco_fisico: string | null
          doacoes: string | null
          thumbnail_url: string | null
          admin_approved: boolean
          lat: number | null
          lng: number | null
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
          localizacao_tipo?: 'presencial' | 'online' | 'ambos' | 'itinerante' | null
          endereco_online?: string[] | null
          necessidades?: string[] | null
          whatsapp?: string | null
          endereco_fisico?: string | null
          doacoes?: string | null
          thumbnail_url?: string | null
          admin_approved?: boolean
          lat?: number | null
          lng?: number | null
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
          localizacao_tipo?: 'presencial' | 'online' | 'ambos' | 'itinerante' | null
          endereco_online?: string[] | null
          necessidades?: string[] | null
          whatsapp?: string | null
          endereco_fisico?: string | null
          doacoes?: string | null
          thumbnail_url?: string | null
          lat?: number | null
          lng?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ongs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "interacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ongs"
            referencedColumns: ["id"]
          }
        ]
      }
      blood_donation_registrations: {
        Row: {
          id: string
          nome_completo: string
          data_nascimento: string
          cpf: string
          endereco: string
          telefone: string
          email: string
          nome_mae: string
          nome_pai: string
          observacoes: string | null
          horario_selecionado: string
          participando_batalha: string
          turma_batalha: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome_completo: string
          data_nascimento: string
          cpf: string
          endereco: string
          telefone: string
          email: string
          nome_mae: string
          nome_pai: string
          observacoes?: string | null
          horario_selecionado: string
          participando_batalha: string
          turma_batalha?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome_completo?: string
          data_nascimento?: string
          cpf?: string
          endereco?: string
          telefone?: string
          email?: string
          nome_mae?: string
          nome_pai?: string
          observacoes?: string | null
          horario_selecionado?: string
          participando_batalha?: string
          turma_batalha?: string | null
        }
        Relationships: []
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
