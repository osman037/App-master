# Mobile App to APK Converter

## Overview

This application is a full-stack web platform that converts mobile app projects (React Native, Flutter, Android, Cordova) into APK files. It provides a comprehensive workflow for uploading project files, analyzing their structure, and building APK packages through an intuitive web interface.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for file uploads, AdmZip for archive handling
- **Development**: Hot reloading with Vite middleware integration

### Data Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless connection
- **Schema**: Strongly typed with Drizzle-Zod validation
- **Storage**: In-memory fallback with interface-based design for flexibility

## Key Components

### Project Management System
- **File Upload**: Drag-and-drop interface with file validation (ZIP files only, 500MB limit)
- **Project Analysis**: Automatic detection of framework type, dependencies, and project structure
- **Build Configuration**: Dynamic configuration based on detected framework
- **Progress Tracking**: Real-time build progress with detailed logging

### Framework Support
- **React Native**: Full support for RN project structure and dependencies
- **Flutter**: Dart project analysis and APK generation
- **Android**: Native Android projects with Gradle build support
- **Cordova**: PhoneGap/Cordova project conversion

### User Interface Components
- **ProcessingSteps**: Visual workflow indicator showing analysis, setup, and build phases
- **ProgressBar**: Real-time progress tracking with status messages
- **BuildLog**: Comprehensive logging with different severity levels
- **ProjectDetails**: Framework detection and project statistics display
- **ActionButtons**: Build control interface (start, pause, stop, download)

## Data Flow

1. **Upload Phase**: User uploads ZIP file → File validation → Storage in uploads directory
2. **Analysis Phase**: Extract project files → Detect framework → Analyze dependencies → Generate build configuration
3. **Build Phase**: Install dependencies → Execute framework-specific build process → Generate APK
4. **Completion**: Store APK metadata → Provide download link → Log completion

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **express**: Web server framework
- **multer**: File upload handling

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Build Tools
- **esbuild**: Fast JavaScript bundler for server-side code
- **drizzle-kit**: Database migration and schema management

## Deployment Strategy

### Development Environment
- **Server**: Development server with hot reloading via Vite middleware
- **Database**: Neon Database connection with environment variable configuration
- **File Storage**: Local filesystem with configurable upload/build directories

### Production Environment
- **Build Process**: 
  1. Client-side: Vite builds React app to `dist/public`
  2. Server-side: esbuild bundles Express server to `dist/index.js`
- **Static Assets**: Served directly by Express in production
- **Database**: PostgreSQL with connection pooling via Neon Database
- **File Handling**: Persistent storage for uploaded files and generated APKs

### Configuration Management
- **Environment Variables**: Database URL, development/production mode flags
- **Path Aliases**: TypeScript path mapping for clean imports
- **Build Scripts**: Separate development and production build processes

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

✓ Migration from Replit Agent to standard Replit environment completed
✓ Fixed build validation errors and false "build failed" popups
✓ Enhanced project analysis with proper framework detection
✓ Improved error handling and user experience
✓ Added support for generic mobile projects
✓ Implemented demo APK creation for better user testing

## Changelog

- July 07, 2025: Migration completed - Fixed project setup errors, enhanced validation, improved build process
- July 07, 2025: Initial setup