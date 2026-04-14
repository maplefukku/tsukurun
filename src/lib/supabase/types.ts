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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "projects_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "conversations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "published_sites_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
