import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// For development, we'll use the default values
// For production, these should be set in the deployment environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xxycchflfhkualokawbs.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eWNjaGZsZmhrdWFsb2thd2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzU0NDAsImV4cCI6MjA1NDE1MTQ0MH0.-H2aJ3B4Oie1QnSolMc_4Ry9QEXDP0jvHHVhh9cQxvw";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

// Add some debug logging to help troubleshoot connection issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  if (session) {
    console.log('User session available');
  } else {
    console.log('No user session available');
  }
});