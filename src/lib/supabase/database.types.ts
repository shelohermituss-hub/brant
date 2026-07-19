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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_table: string
          id: string
          reference: string | null
          state_after: Json | null
          state_before: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_table: string
          id?: string
          reference?: string | null
          state_after?: Json | null
          state_before?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_table?: string
          id?: string
          reference?: string | null
          state_after?: Json | null
          state_before?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          amount: number
          collection_fee: number
          created_at: string
          cycle_number: number
          group_id: string
          id: string
          membership_id: string
          moncash_ref: string | null
          month: string
          paid_at: string | null
          state: Database["public"]["Enums"]["contribution_state"]
          updated_at: string
        }
        Insert: {
          amount: number
          collection_fee?: number
          created_at?: string
          cycle_number: number
          group_id: string
          id?: string
          membership_id: string
          moncash_ref?: string | null
          month: string
          paid_at?: string | null
          state?: Database["public"]["Enums"]["contribution_state"]
          updated_at?: string
        }
        Update: {
          amount?: number
          collection_fee?: number
          created_at?: string
          cycle_number?: number
          group_id?: string
          id?: string
          membership_id?: string
          moncash_ref?: string | null
          month?: string
          paid_at?: string | null
          state?: Database["public"]["Enums"]["contribution_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          amount: number
          created_at: string
          current_cycle: number
          id: string
          monthly_amount: number
          name: string
          organizer_id: string
          pot_day: number
          state: Database["public"]["Enums"]["group_state"]
          total_members: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          current_cycle?: number
          id?: string
          monthly_amount: number
          name: string
          organizer_id: string
          pot_day: number
          state?: Database["public"]["Enums"]["group_state"]
          total_members: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          current_cycle?: number
          id?: string
          monthly_amount?: number
          name?: string
          organizer_id?: string
          pot_day?: number
          state?: Database["public"]["Enums"]["group_state"]
          total_members?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_requests: {
        Row: {
          decided_at: string | null
          decided_by: string | null
          group_id: string
          id: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          decided_at?: string | null
          decided_by?: string | null
          group_id: string
          id?: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          decided_at?: string | null
          decided_by?: string | null
          group_id?: string
          id?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_requests_decided_by_fkey"
            columns: ["decided_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          position: number
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          position: number
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          position?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          beneficiary_membership_id: string
          beneficiary_moncash_number: string
          created_at: string
          cycle_number: number
          group_id: string
          id: string
          moncash_ref: string | null
          month: string
          state: Database["public"]["Enums"]["payout_state"]
          transfer_fee: number
          updated_at: string
          verified_by_api: boolean
        }
        Insert: {
          amount: number
          beneficiary_membership_id: string
          beneficiary_moncash_number: string
          created_at?: string
          cycle_number: number
          group_id: string
          id?: string
          moncash_ref?: string | null
          month: string
          state?: Database["public"]["Enums"]["payout_state"]
          transfer_fee?: number
          updated_at?: string
          verified_by_api?: boolean
        }
        Update: {
          amount?: number
          beneficiary_membership_id?: string
          beneficiary_moncash_number?: string
          created_at?: string
          cycle_number?: number
          group_id?: string
          id?: string
          moncash_ref?: string | null
          month?: string
          state?: Database["public"]["Enums"]["payout_state"]
          transfer_fee?: number
          updated_at?: string
          verified_by_api?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "payouts_beneficiary_membership_id_fkey"
            columns: ["beneficiary_membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      position_assignment_policy: {
        Row: {
          id: boolean
          min_score_for_20th_percentile: number
          min_score_for_50th_percentile: number
          min_score_for_any_position: number
          updated_at: string
        }
        Insert: {
          id?: boolean
          min_score_for_20th_percentile?: number
          min_score_for_50th_percentile?: number
          min_score_for_any_position?: number
          updated_at?: string
        }
        Update: {
          id?: boolean
          min_score_for_20th_percentile?: number
          min_score_for_50th_percentile?: number
          min_score_for_any_position?: number
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referred_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      score_history: {
        Row: {
          id: string
          recorded_at: string
          score_snapshot: number
          sik_number: number
          user_id: string
        }
        Insert: {
          id?: string
          recorded_at?: string
          score_snapshot: number
          sik_number: number
          user_id: string
        }
        Update: {
          id?: string
          recorded_at?: string
          score_snapshot?: number
          sik_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          consent_signed_at: string | null
          created_at: string
          full_name: string
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          merchant_tier: Database["public"]["Enums"]["merchant_tier"]
          moncash_number: string
          phone: string
          referral_code: string
          role: Database["public"]["Enums"]["user_role"]
          trust_score: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          consent_signed_at?: string | null
          created_at?: string
          full_name: string
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          merchant_tier?: Database["public"]["Enums"]["merchant_tier"]
          moncash_number: string
          phone: string
          referral_code?: string
          role?: Database["public"]["Enums"]["user_role"]
          trust_score?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          consent_signed_at?: string | null
          created_at?: string
          full_name?: string
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          merchant_tier?: Database["public"]["Enums"]["merchant_tier"]
          moncash_number?: string
          phone?: string
          referral_code?: string
          role?: Database["public"]["Enums"]["user_role"]
          trust_score?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          reference: string | null
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          reference?: string | null
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          reference?: string | null
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          processed: boolean
          processed_at: string | null
          raw_payload: Json
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key: string
          processed?: boolean
          processed_at?: string | null
          raw_payload: Json
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          processed?: boolean
          processed_at?: string | null
          raw_payload?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_wallet_transaction: {
        Args: {
          p_amount: number
          p_reference?: string
          p_type: string
          p_user_id: string
        }
        Returns: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          reference: string | null
          type: string
          wallet_id: string
        }
      }
      assign_position: {
        Args: { p_group_id: string; p_user_id: string }
        Returns: number
      }
      calculate_collection_fee: {
        Args: {
          p_amount: number
          p_tier: Database["public"]["Enums"]["merchant_tier"]
        }
        Returns: number
      }
      calculate_transfer_fee: { Args: { p_amount: number }; Returns: number }
      is_username_available: { Args: { p_username: string }; Returns: boolean }
      set_wallet_pin: { Args: { p_pin: string }; Returns: undefined }
      verify_wallet_pin: { Args: { p_pin: string }; Returns: boolean }
      has_wallet_pin: { Args: Record<PropertyKey, never>; Returns: boolean }
    }
    Enums: {
      contribution_state: "due" | "pending" | "paid" | "late" | "defaulted"
      group_state:
        | "forming"
        | "active"
        | "collecting"
        | "pot_ready"
        | "pot_sent"
        | "next_month"
        | "completed"
      kyc_status: "pending" | "verified" | "rejected"
      merchant_tier: "bronze" | "silver" | "gold"
      payout_state: "pending" | "verified" | "sent" | "confirmed" | "failed"
      user_role: "member" | "admin"
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
    Enums: {
      contribution_state: ["due", "pending", "paid", "late", "defaulted"],
      group_state: [
        "forming",
        "active",
        "collecting",
        "pot_ready",
        "pot_sent",
        "next_month",
        "completed",
      ],
      kyc_status: ["pending", "verified", "rejected"],
      merchant_tier: ["bronze", "silver", "gold"],
      payout_state: ["pending", "verified", "sent", "confirmed", "failed"],
      user_role: ["member", "admin"],
    },
  },
} as const
