# User Achievements Web Frontend

This is a React frontend for the User Achievements API. It displays user achievement levels and details using a modern React application built with Vite, TypeScript, and Material UI.

## Prerequisites

-   Node.js (v14 or later)
-   npm (v6 or later)
-   .NET backend API running on http://localhost:5041

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to http://localhost:5173

## Features

-   View all users and their achievement levels
-   View detailed information about individual users
-   Responsive design with Material UI components
-   PS inspired theme

## Project Structure

-   `src/components/` - React components
-   `src/services/` - API service for backend communication
-   `src/types/` - TypeScript interfaces
-   `src/hooks/` - Custom hooks for data fetching

## Building for Production

To build the application for production, run:

```bash
npm run build
```

The build output will be in the `dist` directory.
