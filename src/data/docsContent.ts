export interface ExampleType {
  type: 'photo-upload' | 'renaming-pattern' | 'gallery-view' | 'admin-panel';
  title: string;
  description: string;
  steps: string[];
}

export interface DocSubsection {
  title: string;
  content: string;
  steps?: string[];
  tips?: string[];
  warnings?: string[];
}

export interface DocSection {
  id: string;
  title: string;
  description?: string;
  category: string;
  content: string;
  sections?: DocSubsection[];
  example?: ExampleType;
  relatedLinks?: Array<{
    title: string;
    description: string;
    id: string;
  }>;
  keywords: string[];
}

export const docsContent: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of our AI-powered photo management platform",
    category: "Getting Started",
    content: `Welcome to our comprehensive photo management platform! This guide will help you get started with uploading, organizing, and renaming your photos using advanced AI technology.

Our platform combines powerful AI analysis with intuitive user controls to transform your photo organization workflow. Whether you're a photographer managing thousands of images or someone looking to organize personal photos, our tools are designed to save you time and improve your file organization.`,
    sections: [
      {
        title: "Quick Start Guide",
        content: `Get up and running in just a few minutes with these essential first steps.`,
        steps: [
          "Create your account and complete the onboarding process",
          "Navigate to the dashboard to access all features",
          "Upload your first batch of photos using our drag-and-drop interface",
          "Try the AI renaming feature to see intelligent file naming in action",
          "Explore the photo gallery to manage your uploaded images"
        ],
        tips: [
          "Start with a small batch of photos to familiarize yourself with the interface",
          "Check out the interactive examples in each documentation section",
          "Use the search feature to quickly find specific documentation topics"
        ]
      },
      {
        title: "Account Creation & Onboarding",
        content: `Setting up your account is straightforward and includes a guided onboarding process to personalize your experience.`,
        steps: [
          "Click the login/signup button on the homepage",
          "Choose your authentication method (email or social login)",
          "Complete the onboarding flow with your name and use case",
          "Set your birthday for personalized features",
          "Access your personalized dashboard"
        ],
        tips: [
          "Your onboarding information helps us customize the interface for your needs",
          "You can update your profile information anytime from the dashboard"
        ]
      },
      {
        title: "Dashboard Overview",
        content: `Your dashboard is the central hub for all photo management activities, providing quick access to all features and recent activity.`,
        steps: [
          "View your recent photo uploads and activity",
          "Access the main photo upload and renaming tools",
          "Monitor your storage usage and file statistics",
          "Navigate to different sections using the main menu",
          "Access account settings and preferences"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Photo Upload Guide",
        description: "Learn how to upload and organize your photos",
        id: "photo-upload"
      },
      {
        title: "AI Renaming Features",
        description: "Discover how AI can automatically name your photos",
        id: "ai-renaming"
      }
    ],
    keywords: ["getting started", "onboarding", "account", "dashboard", "first steps", "quick start"]
  },

  {
    id: "photo-upload",
    title: "Photo Upload",
    description: "Learn how to upload and manage your photos efficiently",
    category: "Photo Management",
    content: `Our photo upload system supports drag-and-drop functionality, batch uploads, and automatic metadata extraction. You can upload multiple photos simultaneously and see real-time progress as your files are processed.

The system automatically extracts important metadata like file size, dimensions, and creation date. Supported formats include JPEG, PNG, and other common image formats with intelligent file validation.`,
    sections: [
      {
        title: "Upload Methods",
        content: `Multiple ways to upload your photos for maximum convenience.`,
        steps: [
          "Drag and drop files directly onto the upload zone",
          "Click the upload area to open your file browser",
          "Select single or multiple photos at once",
          "Monitor upload progress with real-time status updates"
        ],
        tips: [
          "You can upload up to 50 photos at once for optimal performance",
          "Larger files may take longer to process, but you can continue using other features",
          "Supported formats: JPEG, JPG, PNG, WEBP"
        ],
        warnings: [
          "Maximum file size is 10MB per photo",
          "Photos are automatically compressed for storage optimization"
        ]
      },
      {
        title: "File Organization",
        content: `Understanding how your uploaded photos are organized and stored.`,
        steps: [
          "Photos are automatically organized by upload date",
          "Each photo receives a unique identifier for tracking",
          "Metadata is extracted and stored for search functionality",
          "Preview thumbnails are generated for quick browsing"
        ]
      }
    ],
    example: {
      type: 'photo-upload',
      title: 'Photo Upload Process',
      description: 'See how photos are uploaded and processed in real-time',
      steps: [
        'Select photos from your device',
        'Upload and analyze with AI',
        'Review processed results'
      ]
    },
    relatedLinks: [
      {
        title: "Photo Gallery",
        description: "Manage and organize your uploaded photos",
        id: "photo-gallery"
      },
      {
        title: "AI Photo Renaming",
        description: "Automatically rename photos with AI analysis",
        id: "ai-renaming"
      }
    ],
    keywords: ["upload", "photos", "drag drop", "batch upload", "file formats", "metadata"]
  },

  {
    id: "photo-gallery",
    title: "Photo Gallery",
    description: "Navigate and manage your photo collection",
    category: "Photo Management", 
    content: `The photo gallery provides a comprehensive view of all your uploaded photos with powerful organization and management tools. View photos in different layouts, search by filename, and perform batch operations.

Features include grid and list views, sorting options, selection tools, and detailed photo information display. The gallery is optimized for performance even with large photo collections.`,
    sections: [
      {
        title: "Gallery Navigation",
        content: `Efficiently browse and organize your photo collection.`,
        steps: [
          "Switch between grid and list view modes",
          "Sort photos by name, date, or size",
          "Use the search bar to find specific photos",
          "Select multiple photos for batch operations"
        ],
        tips: [
          "Grid view is perfect for visual browsing",
          "List view shows more detailed information",
          "Use Ctrl/Cmd+click to select multiple photos"
        ]
      },
      {
        title: "Photo Information",
        content: `View detailed information about each photo including metadata and AI analysis results.`,
        steps: [
          "Click on any photo to view full details",
          "See original filename and AI-generated name",
          "View file size, dimensions, and upload date",
          "Access individual photo actions like rename or delete"
        ]
      },
      {
        title: "Batch Operations",
        content: `Perform actions on multiple photos simultaneously to save time.`,
        steps: [
          "Select multiple photos using checkboxes or keyboard shortcuts",
          "Choose from batch actions: rename, delete, or download",
          "Monitor progress of batch operations",
          "Review results and handle any errors"
        ],
        warnings: [
          "Batch delete operations cannot be undone",
          "Large batch operations may take several minutes to complete"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Photo Upload",
        description: "Learn how to add photos to your gallery",
        id: "photo-upload"
      },
      {
        title: "Photo Renamer Tool",
        description: "Advanced renaming with custom patterns",
        id: "photo-renamer"
      }
    ],
    keywords: ["gallery", "browse", "organize", "search", "batch operations", "photo management"]
  },

  {
    id: "ai-renaming",
    title: "AI Photo Renaming",
    description: "Automatically generate meaningful filenames using AI analysis",
    category: "Photo Management",
    content: `Our AI photo renaming system uses advanced computer vision to analyze your photos and generate descriptive, meaningful filenames. The AI can identify objects, scenes, activities, and even emotions in your photos to create relevant names.

Powered by OpenAI's vision models, the system can process photos individually or in batches, learning from context and providing increasingly accurate naming suggestions.`,
    sections: [
      {
        title: "How AI Analysis Works",
        content: `Understanding the technology behind intelligent photo naming.`,
        steps: [
          "Photos are securely uploaded to our processing system",
          "AI analyzes visual content including objects, scenes, and activities",  
          "Context and composition are evaluated for relevance",
          "Descriptive filenames are generated based on the analysis",
          "Results are returned with confidence scores and alternatives"
        ],
        tips: [
          "Photos with clear subjects and good lighting produce better results",
          "The AI can identify multiple objects and activities in a single photo",
          "Names are generated to be filesystem-friendly (no special characters)"
        ]
      },
      {
        title: "Individual Photo Renaming",
        content: `Rename single photos with AI assistance for precise control.`,
        steps: [
          "Select a photo from your gallery",
          "Click the 'AI Rename' button",
          "Wait for AI analysis to complete (usually 5-10 seconds)",
          "Review the suggested filename",
          "Accept the suggestion or edit it manually"
        ],
        tips: [
          "You can always edit AI suggestions before applying them",
          "The original filename is preserved in the system for reference"
        ]
      },
      {
        title: "Batch AI Renaming",
        content: `Process multiple photos simultaneously for efficient workflow.`,
        steps: [
          "Select multiple photos using the gallery selection tools",
          "Click 'Batch AI Rename' from the actions menu",
          "Monitor progress as each photo is analyzed",
          "Review all suggested names before applying",
          "Approve all or selectively apply renames"
        ],
        warnings: [
          "Batch operations can take several minutes for large photo sets",
          "AI analysis requires internet connectivity",
          "Processing costs may apply for large batch operations"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Photo Gallery",
        description: "Manage your renamed photos",
        id: "photo-gallery"
      },
      {
        title: "Photo Renamer Tool",
        description: "Advanced renaming with custom patterns",
        id: "photo-renamer"
      }
    ],
    keywords: ["AI", "artificial intelligence", "rename", "analysis", "automatic", "computer vision", "batch processing"]
  },

  {
    id: "photo-renamer",
    title: "Photo Renamer Tool",
    description: "Advanced photo renaming with custom patterns and rules",
    category: "Photo Management",
    content: `The Photo Renamer tool provides advanced renaming capabilities with custom patterns, prefixes, suffixes, and numbering systems. Create consistent naming conventions for your photo collections with powerful rule-based renaming.

This tool complements AI renaming by allowing you to apply systematic naming patterns, combine AI suggestions with custom rules, and maintain consistent file naming across your entire photo library.`,
    sections: [
      {
        title: "Custom Naming Patterns",
        content: `Create sophisticated naming rules for consistent file organization.`,
        steps: [
          "Access the Photo Renamer from the main dashboard",
          "Upload photos or select from existing gallery",
          "Configure prefix, suffix, and numbering options",
          "Preview the naming pattern before applying",
          "Apply pattern to selected photos"
        ],
        tips: [
          "Use descriptive prefixes to categorize photo types (e.g., 'wedding_', 'vacation_')",
          "Sequential numbering helps maintain order",
          "Preview function shows exactly how files will be renamed"
        ]
      },
      {
        title: "Pattern Configuration",
        content: `Understanding the various pattern options and how to use them effectively.`,
        steps: [
          "Set prefix text for categorization",
          "Choose numbering format: sequential, random, or timestamp",
          "Configure suffix for additional context",
          "Select case transformation options",
          "Define separator characters and special character handling"
        ]
      },
      {
        title: "Combining with AI Suggestions",
        content: `Use AI-generated names as part of your custom patterns for the best of both approaches.`,
        steps: [
          "Generate AI names for your photos first",
          "Use AI suggestions as base names in patterns",
          "Add prefixes and suffixes to AI-generated names",
          "Apply numbering to maintain sequence",
          "Review and approve final naming scheme"
        ]
      }
    ],
    example: {
      type: 'renaming-pattern',
      title: 'Custom Naming Pattern',
      description: 'See how custom patterns transform your filenames',
      steps: [
        'Configure naming pattern',
        'Preview results',
        'Apply to photos'
      ]
    },
    relatedLinks: [
      {
        title: "AI Photo Renaming",
        description: "Automatic naming with AI analysis",
        id: "ai-renaming"  
      },
      {
        title: "Photo Gallery",
        description: "Manage your organized photos",
        id: "photo-gallery"
      }
    ],
    keywords: ["renamer", "patterns", "custom", "rules", "prefix", "suffix", "numbering", "organization"]
  },

  {
    id: "profile",
    title: "Profile Management",
    description: "Manage your account information and preferences",
    category: "User Account",
    content: `Your user profile contains your personal information, preferences, and account settings. Keep your profile up to date to ensure the best experience with personalized features and communications.

Profile information is used to customize your dashboard experience and provide relevant feature recommendations based on your usage patterns and preferences.`,
    sections: [
      {
        title: "Updating Profile Information",
        content: `Keep your account information current and accurate.`,
        steps: [
          "Navigate to your dashboard",
          "Click on profile settings or account menu",
          "Update your name, email, and other personal information",
          "Set your photo management preferences",
          "Save changes to apply updates"
        ],
        tips: [
          "A complete profile helps us provide better personalized recommendations",
          "Email updates are sent for important account and feature notifications"
        ]
      },
      {
        title: "Privacy Settings",
        content: `Control how your data is used and what information is shared.`,
        steps: [
          "Access privacy settings from your profile",
          "Review data usage and sharing preferences",
          "Configure notification settings",
          "Set photo processing preferences",
          "Update consent and privacy choices"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Authentication",
        description: "Manage login and security settings",
        id: "authentication"
      },
      {
        title: "User Roles",
        description: "Understand your account permissions",
        id: "user-roles"
      }
    ],
    keywords: ["profile", "account", "settings", "personal information", "preferences", "privacy"]
  },

  {
    id: "authentication",
    title: "Authentication",
    description: "Login, logout, and account security management",
    category: "User Account",
    content: `Our authentication system provides secure access to your account with multiple login options and robust security features. We support email-based authentication with secure password handling and session management.

Account security is prioritized with encrypted data transmission, secure session handling, and automatic logout features to protect your account and photos.`,
    sections: [
      {
        title: "Login Process",
        content: `Securely access your account with multiple authentication options.`,
        steps: [
          "Navigate to the login page",
          "Enter your email address",
          "Provide your password or use alternative auth methods",
          "Complete any additional security verification if prompted",
          "Access your personalized dashboard"
        ],
        tips: [
          "Use a strong, unique password for your account",
          "Login sessions remain active for security and convenience",
          "Clear browser data if experiencing login issues"
        ]
      },
      {
        title: "Account Security",
        content: `Protecting your account and data with security best practices.`,
        steps: [
          "Use strong passwords with mixed characters",
          "Keep your email address current for security notifications",
          "Log out from shared or public devices",
          "Monitor account activity for any suspicious access",
          "Contact support if you notice any security concerns"
        ],
        warnings: [
          "Never share your login credentials with others",
          "Log out completely when using public computers",
          "Report any suspicious account activity immediately"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Profile Management", 
        description: "Update your account information",
        id: "profile"
      },
      {
        title: "Dashboard Overview",
        description: "Navigate your account dashboard",
        id: "getting-started"
      }
    ],
    keywords: ["login", "logout", "security", "password", "authentication", "account access"]
  },

  {
    id: "user-roles",
    title: "User Roles & Permissions",
    description: "Understanding different user roles and their capabilities",
    category: "User Account",
    content: `Our platform uses a role-based access control system to provide appropriate features and permissions based on your account type. Different roles have access to different features and administrative capabilities.

The role system ensures that users have access to the right tools while maintaining security and proper access control across the platform.`,
    sections: [
      {
        title: "User Role Types",
        content: `Understanding the different account types and their capabilities.`,
        steps: [
          "Standard User: Full access to photo management features",
          "Moderator: Additional content moderation capabilities", 
          "Administrator: Full system access and user management",
          "Roles are assigned based on account type and requirements",
          "Contact support for role-related questions"
        ]
      },
      {
        title: "Role-Specific Features",
        content: `Different roles provide access to different platform capabilities.`,
        steps: [
          "All users can upload, rename, and manage their own photos",
          "Moderators can access additional content management tools",
          "Administrators can manage users and system settings",
          "Role permissions are clearly indicated in the interface",
          "Some features may require specific role access"
        ],
        tips: [
          "Your current role is displayed in your profile settings",
          "Feature availability depends on your assigned role",
          "Role upgrades may be available for certain account types"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Profile Management",
        description: "View your current role and permissions",
        id: "profile"
      },
      {
        title: "User Management",
        description: "Admin features for managing users (admin only)",
        id: "user-management"
      }
    ],
    keywords: ["roles", "permissions", "access", "user types", "administrator", "moderator", "privileges"]
  },

  {
    id: "dashboard",
    title: "Dashboard Navigation",
    description: "Navigate and use your main dashboard interface",
    category: "User Account",
    content: `Your dashboard is the central command center for all photo management activities. It provides quick access to all features, displays recent activity, and shows important account information at a glance.

The dashboard is designed for efficiency with commonly used features prominently displayed and easy navigation to all platform capabilities.`,
    sections: [
      {
        title: "Dashboard Layout",
        content: `Understanding the main dashboard interface and navigation.`,
        steps: [
          "Main navigation provides access to all major features",
          "Recent activity shows your latest photo uploads and renames",
          "Quick action buttons for common tasks",
          "Storage usage and account information display",
          "Settings and profile access from the main menu"
        ]
      },
      {
        title: "Quick Actions",
        content: `Efficiently access common features directly from your dashboard.`,
        steps: [
          "Upload new photos with one-click access",
          "View recent photos and activity", 
          "Access AI renaming and photo management tools",
          "Check storage usage and account status",
          "Navigate to detailed feature areas"
        ],
        tips: [
          "Pin your most-used features for quick access",
          "Dashboard widgets can be customized based on your usage",
          "Recent activity helps you track your photo management progress"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Getting Started",
        description: "Learn the basics of using the platform",
        id: "getting-started"
      },
      {
        title: "Photo Upload",
        description: "Start uploading photos from your dashboard",
        id: "photo-upload"
      }
    ],
    keywords: ["dashboard", "navigation", "interface", "quick actions", "main menu", "activity"]
  },

  {
    id: "user-management",
    title: "User Management",
    description: "Administrative tools for managing users and roles (Admin only)",
    category: "Admin Features",
    content: `The user management system provides administrators with comprehensive tools to manage user accounts, assign roles, and monitor user activity. This includes user creation, role assignment, account status management, and usage monitoring.

Administrative features are designed to maintain platform security while providing efficient tools for managing user access and capabilities.`,
    sections: [
      {
        title: "User Account Management",
        content: `Managing user accounts and their basic information.`,
        steps: [
          "Access the admin panel from your dashboard",
          "View all registered users in the user management section",
          "Search and filter users by various criteria",
          "View detailed user profiles and activity",
          "Modify user account status and settings"
        ],
        warnings: [
          "User management features are restricted to administrators only",
          "Changes to user accounts should be made carefully",
          "Always verify user identity before making account changes"
        ]
      },
      {
        title: "Role Assignment",
        content: `Assigning and managing user roles and permissions.`,
        steps: [
          "Select a user from the user management interface",
          "View current roles and permissions",
          "Add or remove roles as needed",
          "Verify role changes take effect immediately",
          "Monitor role-based access to ensure proper functionality"
        ],
        tips: [
          "Role changes take effect immediately upon saving",
          "Users are notified of significant role changes",
          "Document role changes for audit purposes"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "User Roles",
        description: "Understanding the role system",
        id: "user-roles"
      },
      {
        title: "Health Monitoring",
        description: "Monitor system health and performance", 
        id: "health-monitoring"
      }
    ],
    keywords: ["admin", "user management", "roles", "permissions", "accounts", "administration"]
  },

  {
    id: "health-monitoring",
    title: "System Health Monitoring",
    description: "Monitor system performance and health metrics (Admin only)",
    category: "Admin Features",
    content: `The health monitoring system provides real-time insights into platform performance, system status, and operational metrics. This includes service availability, response times, error rates, and resource utilization.

Health monitoring helps administrators proactively identify and address system issues before they impact user experience.`,
    sections: [
      {
        title: "Health Status Dashboard",
        content: `Overview of system health and performance metrics.`,
        steps: [
          "Access health monitoring from the admin panel",
          "Review overall system status indicators",
          "Check individual service health status",
          "Monitor response times and performance metrics",
          "Review alerts and system notifications"
        ]
      },
      {
        title: "Performance Metrics",
        content: `Understanding and interpreting system performance data.`,
        steps: [
          "View real-time performance charts and graphs",
          "Monitor database performance and query times",
          "Check file storage and processing metrics",
          "Review user activity and system load",
          "Analyze trends and performance patterns"
        ],
        tips: [
          "Set up alerts for critical performance thresholds",
          "Regular monitoring helps identify issues early",
          "Use historical data to plan capacity and improvements"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Error Logs",
        description: "Review system errors and issues",
        id: "error-logs"
      },
      {
        title: "Analytics",
        description: "View detailed system analytics",
        id: "analytics"
      }
    ],
    keywords: ["health", "monitoring", "performance", "metrics", "system status", "admin", "alerts"]
  },

  {
    id: "error-logs",
    title: "Error Log Analysis",
    description: "Review and analyze system errors and issues (Admin only)",
    category: "Admin Features", 
    content: `The error logging system captures, categorizes, and displays system errors to help administrators identify and resolve issues quickly. Logs include detailed error information, timestamps, and context for effective troubleshooting.

Error analysis helps maintain system stability and identify patterns that may indicate larger system issues or areas for improvement.`,
    sections: [
      {
        title: "Error Log Review",
        content: `Accessing and interpreting system error logs.`,
        steps: [
          "Navigate to error logs in the admin panel",
          "Filter logs by time period, severity, or component",
          "Review error details and stack traces",
          "Identify patterns in error occurrence", 
          "Export logs for detailed analysis or reporting"
        ]
      },
      {
        title: "Error Resolution",
        content: `Using error information to resolve system issues.`,
        steps: [
          "Analyze error patterns and frequency",
          "Identify root causes of recurring errors",
          "Coordinate with technical team for resolution",
          "Monitor error rates after implementing fixes",
          "Document solutions for future reference"
        ],
        warnings: [
          "Some errors may indicate security issues requiring immediate attention",
          "High error rates may impact user experience",
          "Regular log review is essential for system maintenance"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Health Monitoring",
        description: "Monitor overall system health",
        id: "health-monitoring"
      },
      {
        title: "User Management",
        description: "Manage user accounts and access",
        id: "user-management"
      }
    ],
    keywords: ["errors", "logs", "troubleshooting", "analysis", "debugging", "system issues", "admin"]
  },

  {
    id: "analytics",
    title: "Analytics & Metrics",
    description: "View system usage analytics and performance metrics (Admin only)",
    category: "Admin Features",
    content: `The analytics system provides comprehensive insights into platform usage, user behavior, and system performance. This includes user engagement metrics, feature usage statistics, and operational performance data.

Analytics help administrators understand how the platform is being used and identify opportunities for improvement and optimization.`,
    sections: [
      {
        title: "Usage Analytics",
        content: `Understanding platform usage patterns and user behavior.`,
        steps: [
          "Access analytics dashboard from admin panel",
          "Review user activity and engagement metrics",
          "Analyze feature usage and adoption rates",
          "Monitor photo upload and processing volumes",
          "Track user retention and growth patterns"
        ]
      },
      {
        title: "Performance Analytics",
        content: `Analyzing system performance and operational metrics.`,
        steps: [
          "Review response time and performance trends",
          "Monitor resource utilization and capacity",
          "Analyze AI processing times and success rates",
          "Track storage usage and growth patterns",
          "Identify performance bottlenecks and optimization opportunities"
        ],
        tips: [
          "Regular analytics review helps identify trends and issues",
          "Use data to make informed decisions about platform improvements",
          "Set up automated reports for key metrics"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Health Monitoring",
        description: "Monitor real-time system health",
        id: "health-monitoring"
      },
      {
        title: "User Management",
        description: "Manage user accounts based on usage data",
        id: "user-management"
      }
    ],
    keywords: ["analytics", "metrics", "usage", "performance", "statistics", "data", "admin", "insights"]
  },

  {
    id: "api-endpoints",
    title: "API Endpoints",
    description: "Technical documentation for available API endpoints",
    category: "Technical",
    content: `Our platform provides several API endpoints for photo processing, user management, and system operations. These endpoints support the web interface and can be used for custom integrations and automated workflows.

All API endpoints use secure authentication and follow RESTful principles for consistent and predictable behavior.`,
    sections: [
      {
        title: "Photo Processing APIs",
        content: `Endpoints for photo upload, analysis, and renaming operations.`,
        steps: [
          "POST /api/photos/upload - Upload new photos",
          "POST /api/photos/ai-rename - AI-powered photo renaming",
          "POST /api/photos/batch-rename - Batch renaming operations",
          "GET /api/photos/{id} - Retrieve photo information",
          "DELETE /api/photos/{id} - Delete a specific photo"
        ],
        tips: [
          "All photo APIs require user authentication",
          "Batch operations have rate limiting to ensure system stability",
          "Response times vary based on photo size and processing complexity"
        ]
      },
      {
        title: "System APIs",
        content: `Administrative and system monitoring endpoints.`,
        steps: [
          "GET /api/health - System health status",
          "GET /api/analytics - Usage and performance metrics", 
          "POST /api/admin/users - User management operations",
          "GET /api/logs - Error and activity logs",
          "GET /api/status - Real-time system status"
        ],
        warnings: [
          "Administrative APIs require elevated permissions",
          "System APIs may have different rate limits",
          "Some endpoints are restricted to internal use only"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "File Processing",
        description: "Understanding photo processing workflows",
        id: "file-processing"
      },
      {
        title: "Database Schema",
        description: "Data structure and relationships",
        id: "database-schema"
      }
    ],
    keywords: ["API", "endpoints", "technical", "integration", "REST", "HTTP", "authentication"]
  },

  {
    id: "file-processing",
    title: "File Processing Workflow",
    description: "Understanding how photos are processed and stored",
    category: "Technical",
    content: `Our file processing system handles photo uploads, analysis, storage, and optimization through a sophisticated pipeline. This includes file validation, metadata extraction, AI analysis, and secure storage with optimized delivery.

The processing workflow is designed for reliability and performance, with automatic error handling and retry mechanisms for robust operation.`,
    sections: [
      {
        title: "Upload Processing",
        content: `How uploaded photos are validated and processed.`,
        steps: [
          "File validation checks format, size, and integrity",
          "Metadata extraction captures EXIF data and properties",
          "Image processing generates thumbnails and optimized versions",
          "Secure storage saves files with unique identifiers",
          "Database records are created with photo information"
        ]
      },
      {
        title: "AI Analysis Pipeline",
        content: `Understanding the AI analysis and naming process.`,
        steps: [
          "Photos are securely transmitted to AI processing services",
          "Computer vision analysis identifies objects, scenes, and activities",
          "Natural language processing generates descriptive filenames",
          "Results are validated and formatted for filesystem compatibility",
          "Analysis results are stored with confidence scores and alternatives"
        ],
        tips: [
          "Processing times vary based on photo complexity and system load",
          "AI analysis requires internet connectivity to external services",
          "Failed processing operations are automatically retried"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "AI Photo Renaming",
        description: "Learn about AI analysis features",
        id: "ai-renaming"
      },
      {
        title: "API Endpoints",
        description: "Technical API documentation",
        id: "api-endpoints"
      }
    ],
    keywords: ["processing", "workflow", "pipeline", "AI", "storage", "metadata", "technical"]
  },

  {
    id: "database-schema",
    title: "Database Schema",
    description: "Overview of data structure and relationships",
    category: "Technical",
    content: `Our database schema is designed for performance, scalability, and data integrity. The schema includes tables for users, photos, processing jobs, and system logs with proper relationships and indexes for optimal performance.

The schema follows best practices for security with row-level security policies and proper access controls to protect user data and system integrity.`,
    sections: [
      {
        title: "Core Tables",
        content: `Primary database tables and their purposes.`,
        steps: [
          "users - User account information and preferences",
          "photos - Photo metadata, storage paths, and processing status",
          "user_roles - Role-based access control assignments",
          "processing_jobs - AI analysis and batch operation tracking",
          "system_logs - Error logging and audit trails"
        ]
      },
      {
        title: "Security Model",
        content: `Database security implementation and access controls.`,
        steps: [
          "Row-level security (RLS) policies protect user data",
          "Role-based access controls restrict administrative functions",
          "Encrypted storage for sensitive information",
          "Audit logging for all data modifications",
          "Backup and recovery procedures for data protection"
        ],
        warnings: [
          "Direct database access is restricted to authorized personnel only",
          "Schema changes require careful planning and testing",
          "Security policies must be maintained when adding new features"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "User Roles",
        description: "Understanding the role-based access system",
        id: "user-roles"
      },
      {
        title: "API Endpoints",
        description: "How APIs interact with the database",
        id: "api-endpoints"
      }
    ],
    keywords: ["database", "schema", "tables", "security", "RLS", "data structure", "technical"]
  },

  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Common issues and their solutions",
    category: "Technical",
    content: `This troubleshooting guide covers common issues users may encounter and provides step-by-step solutions. Issues range from upload problems to AI processing errors and account access difficulties.

Most issues can be resolved with simple troubleshooting steps, but this guide also covers when to contact support for more complex problems.`,
    sections: [
      {
        title: "Upload Issues",
        content: `Resolving problems with photo uploads and file processing.`,
        steps: [
          "Check file format compatibility (JPEG, PNG, WEBP supported)",
          "Verify file size is under the 10MB limit",
          "Ensure stable internet connection during upload",
          "Clear browser cache and cookies if uploads fail",
          "Try uploading smaller batches if large batches fail"
        ],
        tips: [
          "Refresh the page if uploads appear stuck",
          "Check browser console for specific error messages",
          "Try a different browser if issues persist"
        ]
      },
      {
        title: "AI Processing Problems",
        content: `Troubleshooting AI analysis and renaming issues.`,
        steps: [
          "Verify internet connectivity for AI processing", 
          "Check if photos are clear and well-lit for better AI analysis",
          "Wait for processing to complete (may take 30+ seconds for large photos)",
          "Retry AI analysis if it fails the first time",
          "Contact support if AI processing consistently fails"
        ],
        warnings: [
          "AI processing requires active internet connection",
          "Very dark or blurry photos may not process well",
          "Processing may be slower during peak usage times"
        ]
      },
      {
        title: "Account and Login Issues",
        content: `Resolving authentication and account access problems.`,
        steps: [
          "Verify email address and password are correct",
          "Check for browser-saved incorrect credentials",
          "Clear browser data and try logging in again",
          "Ensure cookies are enabled for the site",
          "Contact support for account recovery assistance"
        ]
      }
    ],
    relatedLinks: [
      {
        title: "Getting Started",
        description: "Basic platform usage guide",
        id: "getting-started"
      },
      {
        title: "Authentication",
        description: "Login and account security",
        id: "authentication"
      }
    ],
    keywords: ["troubleshooting", "issues", "problems", "solutions", "help", "support", "errors"]
  }
];