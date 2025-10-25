# Client Portal Application

## Overview

This is the **Client Portal Lexora** application for the Law Firm Management System (Lexora). It provides a dedicated interface for law firm clients to access their cases, documents, requests, and services.

## Project Information

- **Name**: Client App
- **Version**: 0.1.0
- **Framework**: Next.js 15.5.6
- **React Version**: 19.1.0
- **Type**: Client-facing web application

## Features

### Core Functionality
- **Authentication System**: Secure client login with glass-morphism design
- **Case Management**: View assigned cases and case details with modern UI
- **Document Access**: Browse and download case-related documents
- **Service Requests**: Submit and track service requests with modal forms
- **Multi-language Support**: Arabic and English with dropdown selector
- **Responsive Design**: Mobile-first approach with hamburger menu

### Key Modules
- **Cases**: View and track legal cases with detailed information cards
- **Documents**: Access case documents with file type icons and download
- **Requests**: Submit and manage client requests with status tracking
- **Services**: Browse available legal services

## Technology Stack

### Frontend Framework
- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library
- **Turbopack** - Fast bundler for development and build

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Radix UI** - Primitive components for building design systems
- **PostCSS** - CSS processing

### Libraries & Tools
- **axios** (^1.12.2) - HTTP client for API requests
- **next-intl** (^4.3.12) - Internationalization for Next.js
- **lucide-react** (^0.546.0) - Icon library
- **class-variance-authority** - For component variant styling
- **clsx** & **tailwind-merge** - Utility for conditional className
- **ESLint** - Code linting and quality

## Project Structure

```
client-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── cases/             # Cases module
│   │   ├── documents/         # Documents module
│   │   ├── login/             # Authentication
│   │   ├── requests/          # Client requests
│   │   ├── services/          # Available services
│   │   ├── layout.js          # Root layout with Noto Sans Arabic font
│   │   ├── globals.css        # Global styles with shadcn variables
│   │   └── page.js            # Home page
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.jsx    # Button component with variants
│   │   │   ├── card.jsx      # Card components
│   │   │   ├── input.jsx     # Input component
│   │   │   ├── label.jsx     # Label component
│   │   │   ├── alert.jsx     # Alert component
│   │   │   ├── checkbox.jsx  # Checkbox component
│   │   │   └── select.jsx    # Select dropdown component
│   │   ├── Header.js         # Responsive header with mobile menu
│   │   ├── LanguageSwitcher.js # Language selector dropdown
│   │   └── ProtectedRoute.js  # Route protection
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.js     # Authentication state
│   │   └── LanguageContext.js # Language/i18n state
│   ├── hooks/                 # Custom React hooks
│   │   └── useTranslation.js  # Translation hook
│   └── lib/                   # Utility libraries
│       └── utils.js           # cn() className utility
├── messages/                  # Internationalization files
│   ├── ar.json               # Arabic translations
│   └── en.json               # English translations
├── public/                    # Static assets
│   ├── background.jpg        # Login page background
│   └── log_in_card_logo.png  # Logo for login card
├── package.json              # Dependencies and scripts
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
├── components.json           # shadcn/ui configuration
└── eslint.config.mjs         # ESLint configuration
```

## Architecture

### UI Components (shadcn/ui)
The application uses shadcn/ui components built on Radix UI primitives:

- **Button**: Multiple variants (default, destructive, outline, ghost)
- **Card**: Container components with header, content, and description
- **Input**: Styled form inputs with focus states
- **Label**: Accessible form labels
- **Alert**: Notification and error messages
- **Checkbox**: Checkboxes with proper accessibility
- **Select**: Dropdown select with search and icons

### Design System
- **Neutral Gray Theme**: Consistent gray color palette across all pages
- **Glass-morphism**: Modern backdrop blur effects on login and modals
- **Responsive Layout**: Mobile-first design with breakpoints
- **Icons**: Lucide React icons (FileText, User, Calendar, etc.)
- **Typography**: Noto Sans Arabic font for better Arabic support

### Context Providers
The application uses React Context for global state management:

1. **LanguageProvider**: Manages language switching (Arabic/English)
2. **AuthProvider**: Handles client authentication and session
3. **ProtectedRoute**: Ensures authenticated access to protected pages

### Routing
- Uses Next.js App Router (app directory structure)
- Client-side navigation with protected routes
- Automatic code splitting per route

### Internationalization
- Supports Arabic (RTL) and English (LTR)
- Translation files in `messages/` directory
- Uses `next-intl` for seamless language switching
- Language selector dropdown in responsive header
- Complete translations for all UI elements

## UI/UX Features

### Modern Design
- **Glass-morphism Effects**: Login page and modals with backdrop blur
- **Neutral Color Scheme**: Consistent gray theme throughout
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Card-based Layout**: Clean, organized content presentation
- **Icon Integration**: Lucide icons for visual clarity

### Responsive Features
- **Mobile Navigation**: Hamburger menu with collapsible drawer
- **Sticky Header**: Fixed navigation that stays on scroll
- **Adaptive Layouts**: Grid and flex layouts that adjust to screen size
- **Touch-friendly**: Large tap targets for mobile devices
- **Truncated Text**: Proper text overflow handling

### Accessibility
- **Radix UI Primitives**: Built-in accessibility features
- **Keyboard Navigation**: Full keyboard support for all components
- **ARIA Labels**: Proper semantic HTML and ARIA attributes
- **Focus States**: Clear visual focus indicators
- **Screen Reader Support**: Proper labeling and structure

## Getting Started

For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)

### Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Requirements

- **Node.js**: v18.0.0 or higher
- **npm/yarn/pnpm**: Latest stable version
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

## Configuration Files

- `next.config.mjs` - Next.js configuration
- `jsconfig.json` - JavaScript/IDE configuration
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - Linting rules
- `components.json` - UI components configuration

## API Integration

The client app communicates with the backend API using Axios for:
- Client authentication
- Case data retrieval
- Document downloads
- Request submissions
- Service information

## Security

- Protected routes require authentication
- Session-based access control
- Secure API communication
- Client-specific data isolation

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile, tablet, and desktop
- RTL support for Arabic language
- Backdrop filter support for glass-morphism effects
- CSS Grid and Flexbox support

