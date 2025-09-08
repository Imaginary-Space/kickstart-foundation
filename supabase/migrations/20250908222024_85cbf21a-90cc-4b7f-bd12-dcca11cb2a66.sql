-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs every 5 minutes to cleanup large photos
SELECT cron.schedule(
  'cleanup-large-photos-job',
  '*/5 * * * *', -- every 5 minutes
  $$
  select
    net.http_post(
        url:='https://lrgljpjmugzcmddizskh.supabase.co/functions/v1/cleanup-large-photos',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZ2xqcGptdWd6Y21kZGl6c2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjYzMTcsImV4cCI6MjA2NDA0MjMxN30.Rf8leaftjWX3grCQimnSUgtgSv2uLv-f_BUbBtwje0A"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);