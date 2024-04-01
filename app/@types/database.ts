export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      friends: {
        Row: {
          created_at: string;
          friend_id: string;
          id: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          friend_id: string;
          id?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          friend_id?: string;
          id?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey";
            columns: ["friend_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friends_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      invoice_products: {
        Row: {
          amount: number | null;
          description: string | null;
          id: string;
          invoice_id: string;
          ownership: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          user_id: string;
        };
        Insert: {
          amount?: number | null;
          description?: string | null;
          id?: string;
          invoice_id: string;
          ownership: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          user_id: string;
        };
        Update: {
          amount?: number | null;
          description?: string | null;
          id?: string;
          invoice_id?: string;
          ownership?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_products_invoice_id_fkey";
            columns: ["invoice_id"];
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_products_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_products_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      invoices: {
        Row: {
          created_at: string;
          id: string;
          sub_total: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          sub_total: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          sub_total?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          description: string | null;
          external_id: string;
          id: string;
          unit_price: number;
          user_id: string;
        };
        Insert: {
          description?: string | null;
          external_id: string;
          id?: string;
          unit_price: number;
          user_id: string;
        };
        Update: {
          description?: string | null;
          external_id?: string;
          id?: string;
          unit_price?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_invoice_total: {
        Row: {
          id: string;
          invoice_id: string;
          total: number;
          user_id: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          total: number;
          user_id: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          total?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_invoice_total_invoice_id_fkey";
            columns: ["invoice_id"];
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_invoice_total_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_products: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_products_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_products_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string;
          created_at: string;
          id: string;
          name: string;
          user_name: string;
        };
        Insert: {
          avatar_url: string;
          created_at?: string;
          id: string;
          name: string;
          user_name: string;
        };
        Update: {
          avatar_url?: string;
          created_at?: string;
          id?: string;
          name?: string;
          user_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
