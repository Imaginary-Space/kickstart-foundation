-- Create cancelled_subscriptions table to track subscription cancellations
CREATE TABLE public.cancelled_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT NOT NULL,
  subscription_tier TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  follow_up_sent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.cancelled_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for cancelled_subscriptions table
CREATE POLICY "Admins can manage all cancelled subscriptions" 
ON public.cancelled_subscriptions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for edge functions to insert cancellation records
CREATE POLICY "Webhook can insert cancellation records" 
ON public.cancelled_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance on common queries
CREATE INDEX idx_cancelled_subscriptions_email ON public.cancelled_subscriptions(email);
CREATE INDEX idx_cancelled_subscriptions_stripe_customer ON public.cancelled_subscriptions(stripe_customer_id);
CREATE INDEX idx_cancelled_subscriptions_cancelled_at ON public.cancelled_subscriptions(cancelled_at DESC);