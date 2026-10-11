import { createClient } from "@supabase/supabase-js";

const supabaseURL = 'https://leemiayswlbjrjjhrqpj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZW1pYXlzd2xianJqamhycXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2OTc2MzUsImV4cCI6MjEwNzI3MzYzNX0.K5ljHqmVoxMo75dVaTxH7FC-y6HmcY3NMt-l04PXynI'

export const supabase = createClient(supabaseURL, supabaseAnonKey)