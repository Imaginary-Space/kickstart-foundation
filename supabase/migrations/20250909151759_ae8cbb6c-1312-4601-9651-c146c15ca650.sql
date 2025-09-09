-- Insert remaining documentation content
INSERT INTO public.docs (id, title, description, category, content, sections, example, related_links, keywords, sort_order) VALUES

-- Photo Renamer Tool
('photo-renamer', 'Photo Renamer Tool', 'Advanced photo renaming with custom patterns and rules', 'Photo Management',
'The Photo Renamer tool provides advanced renaming capabilities with custom patterns, prefixes, suffixes, and numbering systems. Create consistent naming conventions for your photo collections with powerful rule-based renaming.

This tool complements AI renaming by allowing you to apply systematic naming patterns, combine AI suggestions with custom rules, and maintain consistent file naming across your entire photo library.',
'[
  {
    "title": "Custom Naming Patterns",
    "content": "Create sophisticated naming rules for consistent file organization.",
    "steps": [
      "Access the Photo Renamer from the main dashboard",
      "Upload photos or select from existing gallery",
      "Configure prefix, suffix, and numbering options",
      "Preview the naming pattern before applying",
      "Apply pattern to selected photos"
    ],
    "tips": [
      "Use descriptive prefixes to categorize photo types (e.g., wedding_, vacation_)",
      "Sequential numbering helps maintain order",
      "Preview function shows exactly how files will be renamed"
    ]
  },
  {
    "title": "Pattern Configuration",
    "content": "Understanding the various pattern options and how to use them effectively.",
    "steps": [
      "Set prefix text for categorization",
      "Choose numbering format: sequential, random, or timestamp",
      "Configure suffix for additional context",
      "Select case transformation options",
      "Define separator characters and special character handling"
    ]
  }
]'::jsonb,
'{"type": "renaming-pattern", "title": "Custom Naming Pattern", "description": "See how custom patterns transform your filenames", "steps": ["Configure naming pattern", "Preview results", "Apply to photos"]}'::jsonb,
'[
  {"title": "AI Photo Renaming", "description": "Automatic naming with AI analysis", "id": "ai-renaming"},
  {"title": "Photo Gallery", "description": "Manage your organized photos", "id": "photo-gallery"}
]'::jsonb,
'{"renamer", "patterns", "custom", "rules", "prefix", "suffix", "numbering", "organization"}', 5),

-- User Account sections
('profile', 'Profile Management', 'Manage your account information and preferences', 'User Account',
'Your user profile contains your personal information, preferences, and account settings. Keep your profile up to date to ensure the best experience with personalized features and communications.

Profile information is used to customize your dashboard experience and provide relevant feature recommendations based on your usage patterns and preferences.',
'[
  {
    "title": "Updating Profile Information",
    "content": "Keep your account information current and accurate.",
    "steps": [
      "Navigate to your dashboard",
      "Click on profile settings or account menu",
      "Update your name, email, and other personal information",
      "Set your photo management preferences",
      "Save changes to apply updates"
    ],
    "tips": [
      "A complete profile helps us provide better personalized recommendations",
      "Email updates are sent for important account and feature notifications"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Authentication", "description": "Manage login and security settings", "id": "authentication"},
  {"title": "User Roles", "description": "Understand your account permissions", "id": "user-roles"}
]'::jsonb,
'{"profile", "account", "settings", "personal information", "preferences", "privacy"}', 6),

('authentication', 'Authentication', 'Login, logout, and account security management', 'User Account',
'Our authentication system provides secure access to your account with multiple login options and robust security features. We support email-based authentication with secure password handling and session management.',
'[
  {
    "title": "Login Process",
    "content": "Securely access your account with multiple authentication options.",
    "steps": [
      "Navigate to the login page",
      "Enter your email address",
      "Provide your password or use alternative auth methods",
      "Complete any additional security verification if prompted",
      "Access your personalized dashboard"
    ],
    "tips": [
      "Use a strong, unique password for your account",
      "Login sessions remain active for security and convenience"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Profile Management", "description": "Update your account information", "id": "profile"}
]'::jsonb,
'{"login", "logout", "security", "password", "authentication", "account access"}', 7),

('user-roles', 'User Roles & Permissions', 'Understanding different user roles and their capabilities', 'User Account',
'Our platform uses a role-based access control system to provide appropriate features and permissions based on your account type. Different roles have access to different features and administrative capabilities.',
'[
  {
    "title": "User Role Types",
    "content": "Understanding the different account types and their capabilities.",
    "steps": [
      "Standard User: Full access to photo management features",
      "Moderator: Additional content moderation capabilities",
      "Administrator: Full system access and user management"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Profile Management", "description": "View your current role and permissions", "id": "profile"}
]'::jsonb,
'{"roles", "permissions", "access", "user types", "administrator", "moderator"}', 8),

-- Admin Features
('user-management', 'User Management', 'Administrative tools for managing users and roles (Admin only)', 'Admin Features',
'The user management system provides administrators with comprehensive tools to manage user accounts, assign roles, and monitor user activity.',
'[
  {
    "title": "User Account Management",
    "content": "Managing user accounts and their basic information.",
    "steps": [
      "Access the admin panel from your dashboard",
      "View all registered users in the user management section",
      "Search and filter users by various criteria"
    ],
    "warnings": [
      "User management features are restricted to administrators only"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "User Roles", "description": "Understanding the role system", "id": "user-roles"}
]'::jsonb,
'{"admin", "user management", "roles", "permissions", "accounts"}', 9),

-- Technical Documentation
('troubleshooting', 'Troubleshooting', 'Common issues and their solutions', 'Technical',
'This troubleshooting guide covers common issues users may encounter and provides step-by-step solutions.',
'[
  {
    "title": "Upload Issues",
    "content": "Resolving problems with photo uploads and file processing.",
    "steps": [
      "Check file format compatibility (JPEG, PNG, WEBP supported)",
      "Verify file size is under the 10MB limit",
      "Ensure stable internet connection during upload"
    ],
    "tips": [
      "Refresh the page if uploads appear stuck",
      "Check browser console for specific error messages"
    ]
  },
  {
    "title": "AI Processing Problems", 
    "content": "Troubleshooting AI analysis and renaming issues.",
    "steps": [
      "Verify internet connectivity for AI processing",
      "Check if photos are clear and well-lit for better AI analysis",
      "Wait for processing to complete (may take 30+ seconds for large photos)"
    ],
    "warnings": [
      "AI processing requires active internet connection",
      "Very dark or blurry photos may not process well"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Getting Started", "description": "Basic platform usage guide", "id": "getting-started"}
]'::jsonb,
'{"troubleshooting", "issues", "problems", "solutions", "help", "support", "errors"}', 10);