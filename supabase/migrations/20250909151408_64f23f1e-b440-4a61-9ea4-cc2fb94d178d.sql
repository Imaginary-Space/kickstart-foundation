-- Create docs table for dynamic documentation content
CREATE TABLE public.docs (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    content text NOT NULL,
    sections jsonb DEFAULT '[]'::jsonb,
    example jsonb DEFAULT null,
    related_links jsonb DEFAULT '[]'::jsonb,
    keywords text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    published boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.docs ENABLE ROW LEVEL SECURITY;

-- Create policies for docs access
CREATE POLICY "Docs are publicly readable" 
ON public.docs 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can manage all docs" 
ON public.docs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_docs_category ON public.docs(category);
CREATE INDEX idx_docs_published ON public.docs(published);
CREATE INDEX idx_docs_sort_order ON public.docs(sort_order);
CREATE INDEX idx_docs_keywords ON public.docs USING GIN(keywords);

-- Create trigger for updated_at
CREATE TRIGGER update_docs_updated_at
    BEFORE UPDATE ON public.docs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the documentation content
INSERT INTO public.docs (id, title, description, category, content, sections, example, related_links, keywords, sort_order) VALUES
('getting-started', 'Getting Started', 'Learn the basics of our AI-powered photo management platform', 'Getting Started', 'Welcome to our comprehensive photo management platform! This guide will help you get started with uploading, organizing, and renaming your photos using advanced AI technology.

Our platform combines powerful AI analysis with intuitive user controls to transform your photo organization workflow. Whether you''re a photographer managing thousands of images or someone looking to organize personal photos, our tools are designed to save you time and improve your file organization.', 
'[
  {
    "title": "Quick Start Guide",
    "content": "Get up and running in just a few minutes with these essential first steps.",
    "steps": [
      "Create your account and complete the onboarding process",
      "Navigate to the dashboard to access all features",
      "Upload your first batch of photos using our drag-and-drop interface",
      "Try the AI renaming feature to see intelligent file naming in action",
      "Explore the photo gallery to manage your uploaded images"
    ],
    "tips": [
      "Start with a small batch of photos to familiarize yourself with the interface",
      "Check out the interactive examples in each documentation section",
      "Use the search feature to quickly find specific documentation topics"
    ]
  },
  {
    "title": "Account Creation & Onboarding",
    "content": "Setting up your account is straightforward and includes a guided onboarding process to personalize your experience.",
    "steps": [
      "Click the login/signup button on the homepage",
      "Choose your authentication method (email or social login)",
      "Complete the onboarding flow with your name and use case",
      "Set your birthday for personalized features",
      "Access your personalized dashboard"
    ],
    "tips": [
      "Your onboarding information helps us customize the interface for your needs",
      "You can update your profile information anytime from the dashboard"
    ]
  },
  {
    "title": "Dashboard Overview",
    "content": "Your dashboard is the central hub for all photo management activities, providing quick access to all features and recent activity.",
    "steps": [
      "View your recent photo uploads and activity",
      "Access the main photo upload and renaming tools",
      "Monitor your storage usage and file statistics",
      "Navigate to different sections using the main menu",
      "Access account settings and preferences"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Photo Upload Guide", "description": "Learn how to upload and organize your photos", "id": "photo-upload"},
  {"title": "AI Renaming Features", "description": "Discover how AI can automatically name your photos", "id": "ai-renaming"}
]'::jsonb,
'{"getting started", "onboarding", "account", "dashboard", "first steps", "quick start"}',
1),

('photo-upload', 'Photo Upload', 'Learn how to upload and manage your photos efficiently', 'Photo Management', 'Our photo upload system supports drag-and-drop functionality, batch uploads, and automatic metadata extraction. You can upload multiple photos simultaneously and see real-time progress as your files are processed.

The system automatically extracts important metadata like file size, dimensions, and creation date. Supported formats include JPEG, PNG, and other common image formats with intelligent file validation.',
'[
  {
    "title": "Upload Methods",
    "content": "Multiple ways to upload your photos for maximum convenience.",
    "steps": [
      "Drag and drop files directly onto the upload zone",
      "Click the upload area to open your file browser",
      "Select single or multiple photos at once",
      "Monitor upload progress with real-time status updates"
    ],
    "tips": [
      "You can upload up to 50 photos at once for optimal performance",
      "Larger files may take longer to process, but you can continue using other features",
      "Supported formats: JPEG, JPG, PNG, WEBP"
    ],
    "warnings": [
      "Maximum file size is 10MB per photo",
      "Photos are automatically compressed for storage optimization"
    ]
  },
  {
    "title": "File Organization",
    "content": "Understanding how your uploaded photos are organized and stored.",
    "steps": [
      "Photos are automatically organized by upload date",
      "Each photo receives a unique identifier for tracking",
      "Metadata is extracted and stored for search functionality",
      "Preview thumbnails are generated for quick browsing"
    ]
  }
]'::jsonb,
'{"type": "photo-upload", "title": "Photo Upload Process", "description": "See how photos are uploaded and processed in real-time", "steps": ["Select photos from your device", "Upload and analyze with AI", "Review processed results"]}'::jsonb,
'[
  {"title": "Photo Gallery", "description": "Manage and organize your uploaded photos", "id": "photo-gallery"},
  {"title": "AI Photo Renaming", "description": "Automatically rename photos with AI analysis", "id": "ai-renaming"}
]'::jsonb,
'{"upload", "photos", "drag drop", "batch upload", "file formats", "metadata"}',
2),

('photo-gallery', 'Photo Gallery', 'Navigate and manage your photo collection', 'Photo Management', 'The photo gallery provides a comprehensive view of all your uploaded photos with powerful organization and management tools. View photos in different layouts, search by filename, and perform batch operations.

Features include grid and list views, sorting options, selection tools, and detailed photo information display. The gallery is optimized for performance even with large photo collections.',
'[
  {
    "title": "Gallery Navigation",
    "content": "Efficiently browse and organize your photo collection.",
    "steps": [
      "Switch between grid and list view modes",
      "Sort photos by name, date, or size",
      "Use the search bar to find specific photos",
      "Select multiple photos for batch operations"
    ],
    "tips": [
      "Grid view is perfect for visual browsing",
      "List view shows more detailed information",
      "Use Ctrl/Cmd+click to select multiple photos"
    ]
  },
  {
    "title": "Photo Information",
    "content": "View detailed information about each photo including metadata and AI analysis results.",
    "steps": [
      "Click on any photo to view full details",
      "See original filename and AI-generated name",
      "View file size, dimensions, and upload date",
      "Access individual photo actions like rename or delete"
    ]
  },
  {
    "title": "Batch Operations",
    "content": "Perform actions on multiple photos simultaneously to save time.",
    "steps": [
      "Select multiple photos using checkboxes or keyboard shortcuts",
      "Choose from batch actions: rename, delete, or download",
      "Monitor progress of batch operations",
      "Review results and handle any errors"
    ],
    "warnings": [
      "Batch delete operations cannot be undone",
      "Large batch operations may take several minutes to complete"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Photo Upload", "description": "Learn how to add photos to your gallery", "id": "photo-upload"},
  {"title": "Photo Renamer Tool", "description": "Advanced renaming with custom patterns", "id": "photo-renamer"}
]'::jsonb,
'{"gallery", "browse", "organize", "search", "batch operations", "photo management"}',
3),

('ai-renaming', 'AI Photo Renaming', 'Automatically generate meaningful filenames using AI analysis', 'Photo Management', 'Our AI photo renaming system uses advanced computer vision to analyze your photos and generate descriptive, meaningful filenames. The AI can identify objects, scenes, activities, and even emotions in your photos to create relevant names.

Powered by OpenAI''s vision models, the system can process photos individually or in batches, learning from context and providing increasingly accurate naming suggestions.',
'[
  {
    "title": "How AI Analysis Works",
    "content": "Understanding the technology behind intelligent photo naming.",
    "steps": [
      "Photos are securely uploaded to our processing system",
      "AI analyzes visual content including objects, scenes, and activities",
      "Context and composition are evaluated for relevance",
      "Descriptive filenames are generated based on the analysis",
      "Results are returned with confidence scores and alternatives"
    ],
    "tips": [
      "Photos with clear subjects and good lighting produce better results",
      "The AI can identify multiple objects and activities in a single photo",
      "Names are generated to be filesystem-friendly (no special characters)"
    ]
  },
  {
    "title": "Individual Photo Renaming",
    "content": "Rename single photos with AI assistance for precise control.",
    "steps": [
      "Select a photo from your gallery",
      "Click the AI Rename button",
      "Wait for AI analysis to complete (usually 5-10 seconds)",
      "Review the suggested filename",
      "Accept the suggestion or edit it manually"
    ],
    "tips": [
      "You can always edit AI suggestions before applying them",
      "The original filename is preserved in the system for reference"
    ]
  },
  {
    "title": "Batch AI Renaming",
    "content": "Process multiple photos simultaneously for efficient workflow.",
    "steps": [
      "Select multiple photos using the gallery selection tools",
      "Click Batch AI Rename from the actions menu",
      "Monitor progress as each photo is analyzed",
      "Review all suggested names before applying",
      "Approve all or selectively apply renames"
    ],
    "warnings": [
      "Batch operations can take several minutes for large photo sets",
      "AI analysis requires internet connectivity",
      "Processing costs may apply for large batch operations"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Photo Gallery", "description": "Manage your renamed photos", "id": "photo-gallery"},
  {"title": "Photo Renamer Tool", "description": "Advanced renaming with custom patterns", "id": "photo-renamer"}
]'::jsonb,
'{"AI", "artificial intelligence", "rename", "analysis", "automatic", "computer vision", "batch processing"}',
4);

-- Continue with more records...
INSERT INTO public.docs (id, title, description, category, content, sections, example, related_links, keywords, sort_order) VALUES
('photo-renamer', 'Photo Renamer Tool', 'Advanced photo renaming with custom patterns and rules', 'Photo Management', 'The Photo Renamer tool provides advanced renaming capabilities with custom patterns, prefixes, suffixes, and numbering systems. Create consistent naming conventions for your photo collections with powerful rule-based renaming.

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
  },
  {
    "title": "Combining with AI Suggestions",
    "content": "Use AI-generated names as part of your custom patterns for the best of both approaches.",
    "steps": [
      "Generate AI names for your photos first",
      "Use AI suggestions as base names in patterns",
      "Add prefixes and suffixes to AI-generated names",
      "Apply numbering to maintain sequence",
      "Review and approve final naming scheme"
    ]
  }
]'::jsonb,
'{"type": "renaming-pattern", "title": "Custom Naming Pattern", "description": "See how custom patterns transform your filenames", "steps": ["Configure naming pattern", "Preview results", "Apply to photos"]}'::jsonb,
'[
  {"title": "AI Photo Renaming", "description": "Automatic naming with AI analysis", "id": "ai-renaming"},
  {"title": "Photo Gallery", "description": "Manage your organized photos", "id": "photo-gallery"}
]'::jsonb,
'{"renamer", "patterns", "custom", "rules", "prefix", "suffix", "numbering", "organization"}',
5),

('profile', 'Profile Management', 'Manage your account information and preferences', 'User Account', 'Your user profile contains your personal information, preferences, and account settings. Keep your profile up to date to ensure the best experience with personalized features and communications.

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
  },
  {
    "title": "Privacy Settings",
    "content": "Control how your data is used and what information is shared.",
    "steps": [
      "Access privacy settings from your profile",
      "Review data usage and sharing preferences",
      "Configure notification settings",
      "Set photo processing preferences",
      "Update consent and privacy choices"
    ]
  }
]'::jsonb,
null,
'[
  {"title": "Authentication", "description": "Manage login and security settings", "id": "authentication"},
  {"title": "User Roles", "description": "Understand your account permissions", "id": "user-roles"}
]'::jsonb,
'{"profile", "account", "settings", "personal information", "preferences", "privacy"}',
6);

-- Insert remaining documentation records
INSERT INTO public.docs (id, title, description, category, content, sections, related_links, keywords, sort_order) VALUES
('authentication', 'Authentication', 'Login, logout, and account security management', 'User Account', 'Our authentication system provides secure access to your account with multiple login options and robust security features. We support email-based authentication with secure password handling and session management.

Account security is prioritized with encrypted data transmission, secure session handling, and automatic logout features to protect your account and photos.',
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
      "Login sessions remain active for security and convenience",
      "Clear browser data if experiencing login issues"
    ]
  },
  {
    "title": "Account Security",
    "content": "Protecting your account and data with security best practices.",
    "steps": [
      "Use strong passwords with mixed characters",
      "Keep your email address current for security notifications",
      "Log out from shared or public devices",
      "Monitor account activity for any suspicious access",
      "Contact support if you notice any security concerns"
    ],
    "warnings": [
      "Never share your login credentials with others",
      "Log out completely when using public computers",
      "Report any suspicious account activity immediately"
    ]
  }
]'::jsonb,
'[
  {"title": "Profile Management", "description": "Update your account information", "id": "profile"},
  {"title": "Dashboard Overview", "description": "Navigate your account dashboard", "id": "getting-started"}
]'::jsonb,
'{"login", "logout", "security", "password", "authentication", "account access"}',
7),

('user-roles', 'User Roles & Permissions', 'Understanding different user roles and their capabilities', 'User Account', 'Our platform uses a role-based access control system to provide appropriate features and permissions based on your account type. Different roles have access to different features and administrative capabilities.

The role system ensures that users have access to the right tools while maintaining security and proper access control across the platform.',
'[
  {
    "title": "User Role Types",
    "content": "Understanding the different account types and their capabilities.",
    "steps": [
      "Standard User: Full access to photo management features",
      "Moderator: Additional content moderation capabilities",
      "Administrator: Full system access and user management",
      "Roles are assigned based on account type and requirements",
      "Contact support for role-related questions"
    ]
  },
  {
    "title": "Role-Specific Features",
    "content": "Different roles provide access to different platform capabilities.",
    "steps": [
      "All users can upload, rename, and manage their own photos",
      "Moderators can access additional content management tools",
      "Administrators can manage users and system settings",
      "Role permissions are clearly indicated in the interface",
      "Some features may require specific role access"
    ],
    "tips": [
      "Your current role is displayed in your profile settings",
      "Feature availability depends on your assigned role",
      "Role upgrades may be available for certain account types"
    ]
  }
]'::jsonb,
'[
  {"title": "Profile Management", "description": "View your current role and permissions", "id": "profile"},
  {"title": "User Management", "description": "Admin features for managing users (admin only)", "id": "user-management"}
]'::jsonb,
'{"roles", "permissions", "access", "user types", "administrator", "moderator", "privileges"}',
8);

-- Insert admin and technical documentation
INSERT INTO public.docs (id, title, description, category, content, sections, related_links, keywords, sort_order) VALUES
('user-management', 'User Management', 'Administrative tools for managing users and roles (Admin only)', 'Admin Features', 'The user management system provides administrators with comprehensive tools to manage user accounts, assign roles, and monitor user activity. This includes user creation, role assignment, account status management, and usage monitoring.

Administrative features are designed to maintain platform security while providing efficient tools for managing user access and capabilities.',
'[
  {
    "title": "User Account Management",
    "content": "Managing user accounts and their basic information.",
    "steps": [
      "Access the admin panel from your dashboard",
      "View all registered users in the user management section",
      "Search and filter users by various criteria",
      "View detailed user profiles and activity",
      "Modify user account status and settings"
    ],
    "warnings": [
      "User management features are restricted to administrators only",
      "Changes to user accounts should be made carefully",
      "Always verify user identity before making account changes"
    ]
  },
  {
    "title": "Role Assignment",
    "content": "Assigning and managing user roles and permissions.",
    "steps": [
      "Select a user from the user management interface",
      "View current roles and permissions",
      "Add or remove roles as needed",
      "Verify role changes take effect immediately",
      "Monitor role-based access to ensure proper functionality"
    ],
    "tips": [
      "Role changes take effect immediately upon saving",
      "Users are notified of significant role changes",
      "Document role changes for audit purposes"
    ]
  }
]'::jsonb,
'[
  {"title": "User Roles", "description": "Understanding the role system", "id": "user-roles"},
  {"title": "Health Monitoring", "description": "Monitor system health and performance", "id": "health-monitoring"}
]'::jsonb,
'{"admin", "user management", "roles", "permissions", "accounts", "administration"}',
9),

('troubleshooting', 'Troubleshooting', 'Common issues and their solutions', 'Technical', 'This troubleshooting guide covers common issues users may encounter and provides step-by-step solutions. Issues range from upload problems to AI processing errors and account access difficulties.

Most issues can be resolved with simple troubleshooting steps, but this guide also covers when to contact support for more complex problems.',
'[
  {
    "title": "Upload Issues",
    "content": "Resolving problems with photo uploads and file processing.",
    "steps": [
      "Check file format compatibility (JPEG, PNG, WEBP supported)",
      "Verify file size is under the 10MB limit",
      "Ensure stable internet connection during upload",
      "Clear browser cache and cookies if uploads fail",
      "Try uploading smaller batches if large batches fail"
    ],
    "tips": [
      "Refresh the page if uploads appear stuck",
      "Check browser console for specific error messages",
      "Try a different browser if issues persist"
    ]
  },
  {
    "title": "AI Processing Problems",
    "content": "Troubleshooting AI analysis and renaming issues.",
    "steps": [
      "Verify internet connectivity for AI processing",
      "Check if photos are clear and well-lit for better AI analysis",
      "Wait for processing to complete (may take 30+ seconds for large photos)",
      "Retry AI analysis if it fails the first time",
      "Contact support if AI processing consistently fails"
    ],
    "warnings": [
      "AI processing requires active internet connection",
      "Very dark or blurry photos may not process well",
      "Processing may be slower during peak usage times"
    ]
  }
]'::jsonb,
'[
  {"title": "Getting Started", "description": "Basic platform usage guide", "id": "getting-started"},
  {"title": "Authentication", "description": "Login and account security", "id": "authentication"}
]'::jsonb,
'{"troubleshooting", "issues", "problems", "solutions", "help", "support", "errors"}',
10);