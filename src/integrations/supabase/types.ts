export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      "Leads Linkedin": {
        Row: {
          connection_status: string | null
          date: string | null
          dm_status: string | null
          entreprise: string | null
          headline: string | null
          id_linkedin: string
          name: string | null
          url: string | null
        }
        Insert: {
          connection_status?: string | null
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id_linkedin: string
          name?: string | null
          url?: string | null
        }
        Update: {
          connection_status?: string | null
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id_linkedin?: string
          name?: string | null
          url?: string | null
        }
        Relationships: []
      }
      post_comments_1: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      Posts: {
        Row: {
          Caption: string | null
          comments_table_name: string | null
          created_at: string
          id: number
          keyword: string | null
          media: string | null
          Post_id: number | null
          post_url: string | null
          table_exist: boolean | null
          Url_lead_magnet: string | null
          urn_post_id: string | null
        }
        Insert: {
          Caption?: string | null
          comments_table_name?: string | null
          created_at: string
          id?: number
          keyword?: string | null
          media?: string | null
          Post_id?: number | null
          post_url?: string | null
          table_exist?: boolean | null
          Url_lead_magnet?: string | null
          urn_post_id?: string | null
        }
        Update: {
          Caption?: string | null
          comments_table_name?: string | null
          created_at?: string
          id?: number
          keyword?: string | null
          media?: string | null
          Post_id?: number | null
          post_url?: string | null
          table_exist?: boolean | null
          Url_lead_magnet?: string | null
          urn_post_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_comments_by_status: {
        Args: { table_name: string }
        Returns: Json
      }
      create_post_comments_table: {
        Args: { post_id_param: number }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
