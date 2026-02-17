
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iuqovthvlhkaghwuwtzj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UIQM6f4-fGcgBPkDy7qflg_i0tn5fMs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
