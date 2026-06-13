// Placeholder Supabase schema types with an example `equipment` table.
//
// The real types are generated from the linked project and require auth. Run:
//   pnpm db:types
// (after `supabase login` or with SUPABASE_ACCESS_TOKEN set) to overwrite this
// file with the actual schema. The `equipment` table below is illustrative — it
// backs the /data-demo example and is replaced wholesale on regeneration.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      equipment: {
        Row: {
          id: string
          name: string
          serial: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          serial: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          serial?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [key: string]: never }
    Functions: { [key: string]: never }
    Enums: { [key: string]: never }
    CompositeTypes: { [key: string]: never }
  }
}
