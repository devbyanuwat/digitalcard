/** Generated from the Supabase schema (project vvlzmxxcmymmkitahvmh). */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          role: string;
          plan: string;
          suspended: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          role?: string;
          plan?: string;
          suspended?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          role?: string;
          plan?: string;
          suspended?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      cards: {
        Row: {
          id: string;
          owner_id: string;
          slug: string;
          title: string | null;
          doc: Json;
          theme_id: string;
          published: boolean;
          featured: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          slug: string;
          title?: string | null;
          doc: Json;
          theme_id?: string;
          published?: boolean;
          featured?: boolean;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          slug?: string;
          title?: string | null;
          doc?: Json;
          theme_id?: string;
          published?: boolean;
          featured?: boolean;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      themes: {
        Row: {
          id: string;
          name: string;
          category: string;
          tier: string;
          data: Json;
          enabled: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: string;
          tier?: string;
          data: Json;
          enabled?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          tier?: string;
          data?: Json;
          enabled?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      card_events: {
        Row: {
          id: number;
          card_id: string;
          type: string;
          created_at: string;
          source: string | null;
          referrer: string | null;
          device: string | null;
          target: string | null;
        };
        Insert: {
          id?: never;
          card_id: string;
          type: string;
          created_at?: string;
          source?: string | null;
          referrer?: string | null;
          device?: string | null;
          target?: string | null;
        };
        Update: {
          id?: never;
          card_id?: string;
          type?: string;
          created_at?: string;
          source?: string | null;
          referrer?: string | null;
          device?: string | null;
          target?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      increment_card_view: { Args: { card_slug: string }; Returns: undefined };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      admin_stats: { Args: Record<string, never>; Returns: Json };
      log_card_event: {
        Args: {
          p_slug: string;
          p_type: string;
          p_source?: string | null;
          p_referrer?: string | null;
          p_device?: string | null;
          p_target?: string | null;
        };
        Returns: undefined;
      };
      card_analytics: { Args: { p_slug: string }; Returns: Json };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
