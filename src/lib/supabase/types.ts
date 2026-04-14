export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          line_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          line_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          line_user_id?: string | null;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          html_template: string;
          base_config: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: string;
          html_template: string;
          base_config?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          category?: string;
          html_template?: string;
          base_config?: Record<string, unknown>;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          template_id: string | null;
          config: Record<string, unknown>;
          generated_html: string | null;
          status: string;
          published_slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          template_id?: string | null;
          config?: Record<string, unknown>;
          generated_html?: string | null;
          status?: string;
          published_slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          template_id?: string | null;
          config?: Record<string, unknown>;
          generated_html?: string | null;
          status?: string;
          published_slug?: string | null;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          project_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          created_at?: string;
        };
        Update: {
          project_id?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          role?: "user" | "assistant";
          content?: string;
        };
      };
      published_sites: {
        Row: {
          id: string;
          project_id: string;
          slug: string;
          html_snapshot: string;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          slug: string;
          html_snapshot: string;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          html_snapshot?: string;
          view_count?: number;
          updated_at?: string;
        };
      };
    };
  };
}
