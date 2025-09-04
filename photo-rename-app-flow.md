# PhotoRename AI App - Structure & User Flow

```mermaid
graph TD
    A[Landing Page] --> B[Sign Up / Login]
    B --> C[Create Free Account]
    C --> D[Supabase Auth]
    D --> E[User Dashboard]
    
    E --> F[Photo Upload Area]
    F --> G[File Drop Zone]
    G --> H[Select Photos]
    H --> I[Upload to Storage]
    I --> J[Process & Store Metadata]
    
    E --> K[User Photo Gallery]
    K --> L[Display Uploaded Photos]
    L --> M[Photo Grid View]
    L --> N[Photo List View]
    
    E --> O[Batch Rename Tools]
    O --> P[Select Photos for Rename]
    P --> Q[Choose Rename Pattern]
    Q --> R[Preview New Names]
    R --> S[Apply Batch Rename]
    S --> T[Download Renamed Photos]
    
    %% Database & Storage
    I --> U[(Supabase Storage)]
    J --> V[(Photos Metadata DB)]
    V --> V1[user_id, filename, original_name, upload_date, file_size]
    
    %% Rename Patterns
    Q --> Q1[Date-based: IMG_YYYY-MM-DD_001]
    Q --> Q2[Custom Prefix: Vacation_001, Vacation_002]
    Q --> Q3[Sequential: Photo_001, Photo_002]
    Q --> Q4[Location-based: Beach_001, Beach_002]
    
    %% User Flow Steps
    A --> A1[Hero: AI Photo Renaming]
    A --> A2[Features: Batch Processing]
    A --> A3[Pricing: Free Plan]
    
    %% Dashboard Components
    E --> E1[Upload Progress]
    E --> E2[Storage Usage]
    E --> E3[Recent Activity]
    
    %% Gallery Features
    K --> K1[Search Photos]
    K --> K2[Filter by Date]
    K --> K3[Sort Options]
    K --> K4[Select Multiple]
    
    %% Download Options
    T --> T1[ZIP Download]
    T --> T2[Individual Downloads]
    T --> T3[Original + Renamed]
    
    %% Authentication Flow
    B --> B1{Existing User?}
    B1 -->|Yes| B2[Login Form]
    B1 -->|No| B3[Registration Form]
    B2 --> D
    B3 --> C
    
    style A fill:#22c55e,stroke:#16a34a,color:#fff
    style E fill:#3b82f6,stroke:#2563eb,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
    style K fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style O fill:#ef4444,stroke:#dc2626,color:#fff
    style T fill:#10b981,stroke:#059669,color:#fff
    style U fill:#ec4899,stroke:#db2777,color:#fff
    style V fill:#ec4899,stroke:#db2777,color:#fff
```

## Core User Journey

1. **Landing** - Users visit the landing page showcasing AI photo renaming
2. **Authentication** - Free account creation with Supabase auth
3. **Dashboard** - Central hub with upload, gallery, and rename tools
4. **Upload** - Drag & drop photo upload with progress tracking
5. **Gallery** - View, search, and manage uploaded photos
6. **Batch Rename** - Select photos, choose patterns, preview, and apply
7. **Download** - Get renamed photos as ZIP or individual files

## Key Features

- **Free Account Creation** - No barriers to entry
- **Photo Upload & Storage** - Secure cloud storage via Supabase
- **Smart Gallery** - Grid/list views with search and filters
- **Batch Renaming** - Multiple naming patterns and preview
- **Download Options** - Flexible download formats

## Database Schema

- **Photos Metadata**: user_id, filename, original_name, upload_date, file_size
- **Supabase Storage**: Secure file storage with user-based access
- **Authentication**: Built-in user management and session handling