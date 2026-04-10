import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing. Please check your environment variables.");
}

// Provide fallback strings to prevent createClient from throwing during initialization
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);

export type Profile = {
  id: string;
  full_name: string;
  role: 'admin' | 'guru' | 'siswa';
  nis?: string;
  kelas?: string;
  jurusan?: 'TKJ' | 'RPL' | 'Multimedia';
  created_at: string;
};

export type Report = {
  id: string;
  reporter_id: string;
  target_name: string;
  incident_date: string;
  incident_location: string;
  description: string;
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  created_at: string;
  reporter?: Profile;
};

export type FollowUp = {
  id: string;
  report_id: string;
  handler_id: string;
  content: string;
  created_at: string;
  handler?: Profile;
};
