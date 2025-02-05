import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// You can replace these with your own values from your Supabase project settings
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xxycchflfhkualokawbs.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eWNjaGZsZmhrdWFsb2thd2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzU0NDAsImV4cCI6MjA1NDE1MTQ0MH0.-H2aJ3B4Oie1QnSolMc";

// Create Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);