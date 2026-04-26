# NovaMart — E-Commerce Platform

A modern, full-stack e-commerce web application built with **React**, **TypeScript**, and **Firebase**.

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend       | React 19, TypeScript, Vite          |
| Styling        | Custom CSS Design System            |
| State          | Zustand                             |
| Animations     | Framer Motion                       |
| Auth           | Firebase Authentication             |
| Database       | Cloud Firestore                     |
| Routing        | React Router v7                     |
| Notifications  | React Hot Toast                     |

## Features

- **Product Catalog** — Browse, search, filter, and sort products across multiple categories
- **Product Detail** — Image gallery, ratings, reviews, stock status, and add-to-cart
- **Shopping Cart** — Slide-out drawer with quantity controls and cart management
- **User Authentication** — Sign up, sign in, and persistent sessions via Firebase Auth
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark / Light Mode** — Theme toggle with system preference support
- **Demo Data Fallback** — App works fully offline with built-in demo products

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Firebase](https://console.firebase.google.com) project with:
  - **Authentication** → Email/Password enabled
  - **Cloud Firestore** → Database created in test mode

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd "capstone project Full Stack"

# Install client dependencies
cd client
npm install
```

### Configuration

Create a `.env` file in the `client/` directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Run Locally

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
capstone project Full Stack/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Firebase API layer (auth, products, cart, orders)
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/
│   │   │   ├── cart/        # Cart drawer
│   │   │   ├── common/      # Error boundary, shared components
│   │   │   ├── layout/      # Header, Layout
│   │   │   └── product/     # Product card
│   │   ├── config/          # Firebase initialization
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route pages (Home, Products, Login, Register)
│   │   ├── store/           # Zustand stores (auth, cart, theme)
│   │   ├── styles/          # CSS design system
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Helper functions
│   ├── .env                 # Firebase config (not committed)
│   └── vite.config.ts
└── server/                  # Express API (legacy, not required)
```

## Screenshots

| Home Page | Product Listing | Cart Drawer |
|-----------|-----------------|-------------|
| Hero section with featured products | Search, filter, sort | Slide-out cart with quantity controls |
