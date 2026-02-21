import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://bvdbpyjudmkkspcxevlp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZGJweWp1ZG1ra3NwY3hldmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDA2MzMsImV4cCI6MjA4NjkxNjYzM30.hRaoAXKTesJarVvg8cBky2Umtb1R7R824gJwgEle77w'
  )
}
