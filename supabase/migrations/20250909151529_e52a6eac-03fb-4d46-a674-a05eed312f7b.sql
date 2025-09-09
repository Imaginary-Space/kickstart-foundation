-- Insert all documentation content into the docs table
INSERT INTO public.docs (id, title, description, category, content, sections, example, related_links, keywords, sort_order) VALUES

-- Getting Started
('getting-started', 'Getting Started', 'Learn the basics of our AI-powered photo management platform', 'Getting Started', 
'Welcome to our comprehensive photo management platform! This guide will help you get started with uploading, organizing, and renaming your photos using advanced AI technology.

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
'{"getting started", "onboarding", "account", "dashboard", "first steps", "quick start"}', 1),

-- Photo Upload
('photo-upload', 'Photo Upload', 'Learn how to upload and manage your photos efficiently', 'Photo Management',
'Our photo upload system supports drag-and-drop functionality, batch uploads, and automatic metadata extraction. You can upload multiple photos simultaneously and see real-time progress as your files are processed.

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
'{"upload", "photos", "drag drop", "batch upload", "file formats", "metadata"}', 2),

-- Photo Gallery
('photo-gallery', 'Photo Gallery', 'Navigate and manage your photo collection', 'Photo Management',
'The photo gallery provides a comprehensive view of all your uploaded photos with powerful organization and management tools. View photos in different layouts, search by filename, and perform batch operations.

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
'{"gallery", "browse", "organize", "search", "batch operations", "photo management"}', 3),

-- AI Renaming
('ai-renaming', 'AI Photo Renaming', 'Automatically generate meaningful filenames using AI analysis', 'Photo Management',
'Our AI photo renaming system uses advanced computer vision to analyze your photos and generate descriptive, meaningful filenames. The AI can identify objects, scenes, activities, and even emotions in your photos to create relevant names.

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
'{"AI", "artificial intelligence", "rename", "analysis", "automatic", "computer vision", "batch processing"}', 4);