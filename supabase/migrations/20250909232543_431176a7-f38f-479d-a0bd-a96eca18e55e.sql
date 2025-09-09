-- Create the app_role enum type that's missing
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');