// Supabase Configuration
const SUPABASE_URL = 'https://zucdtlmuszwgohyuiien.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Y2R0bG11c3p3Z29oeXVpaWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzEzNzEsImV4cCI6MjA3OTU0NzM3MX0.CakEHyukbKJrU0KCOxAnAjx8qXeYtbfZHPlw9_uGMqw';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket name
const BUCKET_NAME = 'Gallery-images';
