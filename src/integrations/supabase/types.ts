export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          category: string
          created_at: string
          creator_id: string | null
          description: string
          id: string
          image_url: string | null
          instructions: string
          materials: string[] | null
          max_age_months: number
          min_age_months: number
          published: boolean | null
          title: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          creator_id?: string | null
          description: string
          id?: string
          image_url?: string | null
          instructions: string
          materials?: string[] | null
          max_age_months: number
          min_age_months: number
          published?: boolean | null
          title: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          creator_id?: string | null
          description?: string
          id?: string
          image_url?: string | null
          instructions?: string
          materials?: string[] | null
          max_age_months?: number
          min_age_months?: number
          published?: boolean | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          categories: string[] | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          max_age_months: number | null
          min_age_months: number | null
          published: boolean | null
          published_date: string | null
          reference_links: string[] | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          categories?: string[] | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          max_age_months?: number | null
          min_age_months?: number | null
          published?: boolean | null
          published_date?: string | null
          reference_links?: string[] | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          categories?: string[] | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          max_age_months?: number | null
          min_age_months?: number | null
          published?: boolean | null
          published_date?: string | null
          reference_links?: string[] | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      babies: {
        Row: {
          birth_date: string
          created_at: string
          gender: string
          height: number
          id: string
          name: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          birth_date: string
          created_at?: string
          gender: string
          height: number
          id?: string
          name: string
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          birth_date?: string
          created_at?: string
          gender?: string
          height?: number
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      baby_milestones: {
        Row: {
          baby_id: string
          completed: boolean
          completion_date: string | null
          created_at: string
          id: string
          milestone_id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          baby_id: string
          completed?: boolean
          completion_date?: string | null
          created_at?: string
          id?: string
          milestone_id: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          baby_id?: string
          completed?: boolean
          completion_date?: string | null
          created_at?: string
          id?: string
          milestone_id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "baby_milestones_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baby_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          baby_id: string
          content: string | null
          created_at: string
          entry_date: string
          id: string
          image_url: string[] | null
          title: string
          updated_at: string
          video_url: string[] | null
        }
        Insert: {
          baby_id: string
          content?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          image_url?: string[] | null
          title: string
          updated_at?: string
          video_url?: string[] | null
        }
        Update: {
          baby_id?: string
          content?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          image_url?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          baby_id: string
          completed: boolean
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          baby_id: string
          completed?: boolean
          created_at?: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          baby_id?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_appointments: {
        Row: {
          appointment_date: string
          appointment_time: string | null
          appointment_type: string
          baby_id: string
          completed: boolean
          created_at: string
          doctor_name: string
          id: string
          location: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time?: string | null
          appointment_type: string
          baby_id: string
          completed?: boolean
          created_at?: string
          doctor_name: string
          id?: string
          location?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string | null
          appointment_type?: string
          baby_id?: string
          completed?: boolean
          created_at?: string
          doctor_name?: string
          id?: string
          location?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_appointments_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_data: {
        Row: {
          allergies: string[] | null
          baby_id: string
          blood_type: string | null
          chronic_conditions: string[] | null
          created_at: string
          health_insurance: string | null
          health_insurance_number: string | null
          id: string
          medications: string[] | null
          pediatrician_contact: string | null
          pediatrician_name: string | null
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          baby_id: string
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          health_insurance?: string | null
          health_insurance_number?: string | null
          id?: string
          medications?: string[] | null
          pediatrician_contact?: string | null
          pediatrician_name?: string | null
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          baby_id?: string
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          health_insurance?: string | null
          health_insurance_number?: string | null
          id?: string
          medications?: string[] | null
          pediatrician_contact?: string | null
          pediatrician_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_data_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_visits: {
        Row: {
          baby_id: string
          created_at: string
          doctor_name: string
          height: number | null
          id: string
          notes: string
          updated_at: string
          visit_date: string
          visit_type: string
          weight: number | null
        }
        Insert: {
          baby_id: string
          created_at?: string
          doctor_name: string
          height?: number | null
          id?: string
          notes?: string
          updated_at?: string
          visit_date: string
          visit_type: string
          weight?: number | null
        }
        Update: {
          baby_id?: string
          created_at?: string
          doctor_name?: string
          height?: number | null
          id?: string
          notes?: string
          updated_at?: string
          visit_date?: string
          visit_type?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_visits_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          age_months: number
          category: string
          created_at: string
          description: string
          id: string
          title: string
        }
        Insert: {
          age_months: number
          category: string
          created_at?: string
          description: string
          id?: string
          title: string
        }
        Update: {
          age_months?: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          content_count: number | null
          created_at: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          professional_bio: string | null
          professional_specialization: string | null
          professional_title: string | null
          updated_at: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          content_count?: number | null
          created_at?: string
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          professional_bio?: string | null
          professional_specialization?: string | null
          professional_title?: string | null
          updated_at?: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          content_count?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          professional_bio?: string | null
          professional_specialization?: string | null
          professional_title?: string | null
          updated_at?: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      vaccines: {
        Row: {
          baby_id: string
          completed: boolean
          created_at: string
          date: string | null
          dose: string | null
          id: string
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          baby_id: string
          completed?: boolean
          created_at?: string
          date?: string | null
          dose?: string | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          baby_id?: string
          completed?: boolean
          created_at?: string
          date?: string | null
          dose?: string | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccines_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "parent" | "professional" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["parent", "professional", "admin"],
    },
  },
} as const
