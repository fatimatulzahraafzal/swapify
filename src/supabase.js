import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://zyzmupokmhuimdxprycy.supabase.co' // Your Project URL
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5em11cG9rbWh1aW1keHByeWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjU3MTgsImV4cCI6MjA4MDk0MTcxOH0.DkupOffMLzXbn5C-TjQqVngUBroC0vbkJfTF1kMDl2Q' // Your anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
