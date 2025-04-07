import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://wdrhxebbetywynzmovgt.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkcmh4ZWJiZXR5d3luem1vdmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjgxNTQsImV4cCI6MjA1OTUwNDE1NH0.1xz7ZmkVWI84tpMy3RfuVyzVk6P4g2cTgVOyKtxbjXM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = "customer" | "vendor" | "admin"

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name?: string
  avatar_url?: string
  phone_number?: string
  store_name?: string
  store_description?: string
  created_at: string
}

