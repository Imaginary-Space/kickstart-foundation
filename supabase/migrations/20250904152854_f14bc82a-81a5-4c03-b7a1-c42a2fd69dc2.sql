-- Create emails table with fake data
CREATE TABLE public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view emails" 
ON public.emails 
FOR SELECT 
USING (true);

-- Insert fake email data
INSERT INTO public.emails (sender_email, sender_name, recipient_email, recipient_name, subject, body, sent_at, read_at) VALUES
('john.doe@example.com', 'John Doe', 'alice.smith@example.com', 'Alice Smith', 'Meeting Tomorrow', 'Hi Alice, just confirming our meeting tomorrow at 2 PM. Looking forward to discussing the project details.', now() - interval '2 hours', now() - interval '1 hour'),
('marketing@acme.com', 'ACME Marketing', 'customer@gmail.com', 'Jane Customer', 'Special Offer - 50% Off!', 'Don''t miss out on our biggest sale of the year! Use code SAVE50 for 50% off all products.', now() - interval '1 day', NULL),
('support@techcorp.com', 'Tech Corp Support', 'user@domain.com', 'Tech User', 'Your Issue Has Been Resolved', 'Good news! We''ve resolved the technical issue you reported. Your account is now fully functional.', now() - interval '3 hours', now() - interval '30 minutes'),
('newsletter@startup.io', 'Startup Weekly', 'subscriber@email.com', 'Newsletter Reader', 'This Week in Tech', 'Here are the top 5 tech stories from this week that every entrepreneur should know about...', now() - interval '12 hours', NULL),
('hr@company.com', 'HR Department', 'employee@company.com', 'Company Employee', 'Welcome to the Team!', 'Welcome aboard! We''re excited to have you join our team. Here''s everything you need to know for your first day.', now() - interval '5 days', now() - interval '4 days'),
('billing@service.com', 'Billing Team', 'client@business.org', 'Business Client', 'Invoice #12345', 'Please find attached your monthly invoice. Payment is due within 30 days of receipt.', now() - interval '1 week', now() - interval '6 days'),
('notifications@app.com', 'App Notifications', 'user123@example.org', 'App User', 'Password Changed Successfully', 'Your password has been changed successfully. If this wasn''t you, please contact support immediately.', now() - interval '8 hours', now() - interval '7 hours'),
('team@project.com', 'Project Team', 'collaborator@work.com', 'Team Member', 'Project Update - Milestone Reached', 'Great news! We''ve successfully reached our Q4 milestone ahead of schedule. Here''s what''s next...', now() - interval '2 days', now() - interval '1 day');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_emails_updated_at
BEFORE UPDATE ON public.emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();