import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvccqbmpvdtknkdkpntv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2Y2NxYm1wdmR0a25rZGtwbnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0MDY4MzEsImV4cCI6MjA0Nzk4MjgzMX0.cklUkneaXncDYN7IUy1PLoS_WVpPFL3PRfD69sIPp04'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})