import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://ucaxkscofbryrtdgcipx.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMTUzODIzMywiZXhwIjoxOTM3MTE0MjMzfQ.tYl--YN33DXquXDfE2zdUwEnW9tArz7rmvWRavzJN6g'
);

export default supabase;