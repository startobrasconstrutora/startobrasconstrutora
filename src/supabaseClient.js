import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ajmpwnauapyxjpdukbgk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbXB3bmF1YXB5eGpwZHVrYmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0ODI3MjYsImV4cCI6MjEwNTA1ODcyNn0.68Z7W5Ycl9xvkAr3nQoL3fYDZIAepGFXs8CXyEhsBpw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)