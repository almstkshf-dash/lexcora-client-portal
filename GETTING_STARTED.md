# Getting Started - Client Portal Application

This guide will help you set up and run the Client Portal application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** (for cloning the repository)

You can verify your installations:

```bash
node --version
npm --version
```

## Installation

### Step 1: Navigate to the Project Directory

```bash
cd client-app
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

This will install all required dependencies listed in `package.json`.

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

Or with pnpm:
```bash
pnpm dev
```

The application will start on **http://localhost:3000**

**Development Features:**
- Hot Module Replacement (HMR) - Changes reflect instantly
- Turbopack bundler for ultra-fast compilation
- Detailed error messages and stack traces
- React DevTools support

### Production Build

To create an optimized production build:

```bash
npm run build
```

This will:
- Optimize and minify code
- Generate static pages where possible
- Create production-ready bundles

### Start Production Server

After building, start the production server:

```bash
npm start
```

The production server will run on **http://localhost:3000**

### Linting

Check code quality and style:

```bash
npm run lint
```

## Environment Configuration

### Backend API Connection

The client app needs to connect to the backend API. Create environment variables if needed:

Create a `.env.local` file in the client-app root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note**: Adjust the URL based on your backend server configuration.

## Application Structure

### Main Entry Points

1. **`src/app/layout.js`** - Root layout with providers
2. **`src/app/page.js`** - Home page
3. **`src/app/login/page.js`** - Login page

### Context Providers

The app is wrapped with these providers:
- **LanguageProvider** - Manages language (AR/EN)
- **AuthProvider** - Manages authentication state
- **ProtectedRoute** - Protects authenticated routes

## First Time Setup

### 1. Start the Backend Server

Before using the client app, ensure the backend server is running:

```bash
cd ../backend
npm install
npm start
```

The backend should be running on **http://localhost:5000**

### 2. Start the Client App

```bash
cd ../client-app
npm run dev
```

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Login

Use client credentials provided by the law firm administrator to log in.

## Available Routes

Once logged in, you can access:

- **`/`** - Dashboard/Home page
- **`/cases`** - View your cases
- **`/documents`** - Access documents
- **`/requests`** - Submit and track requests
- **`/services`** - Browse available services
- **`/login`** - Login page (public)

## Language Switching

The application supports:
- **English** (LTR - Left to Right)
- **Arabic** (RTL - Right to Left)

Language can be switched from the UI (typically in the header/navigation).

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or run on different port
npm run dev -- -p 3001
```

### Dependencies Issues

Clear node_modules and reinstall:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

### Cannot Connect to Backend

1. Verify backend is running on correct port
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check for CORS configuration in backend
4. Verify network/firewall settings

## Development Tips

### Hot Reload Not Working

- Save the file again
- Check terminal for errors
- Restart the dev server

### View Console Logs

- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Debugging

Add `console.log()` statements in your code:

```javascript
console.log('Debug data:', data);
```

Or use React DevTools browser extension for component inspection.

## Code Quality

### Running ESLint

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```

## Performance

### Production Optimization

The production build includes:
- Code minification
- Tree shaking (unused code removal)
- Image optimization
- Automatic code splitting
- Static page generation where possible

### Monitoring Bundle Size

```bash
npm run build
```

Check the output for bundle sizes and optimization suggestions.

## Updates

### Updating Dependencies

Check for updates:

```bash
npm outdated
```

Update all dependencies:

```bash
npm update
```

Update specific package:

```bash
npm install package-name@latest
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The app can be deployed to:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Custom server with Node.js

## Support

For issues or questions:
1. Check the console for error messages
2. Review this documentation
3. Contact the development team
4. Check the backend logs if API-related

---

**Happy Coding! 🚀**
