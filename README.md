# Internet Data Package E-Commerce

> **📅 Availability Window**
> 
> **Start from 17:00 on 02 February 2026 until 23:10 on 02 February 2026** (24-hour format, GMT+7)

A modern, responsive e-commerce platform for purchasing internet data packages, built with React, Vite, and Tailwind CSS.

## Features

- **Modern UI/UX** - Clean, responsive design with Tailwind CSS v4
- **Package Catalog** - Browse 19 different data packages with filtering and sorting
- **Secure Checkout** - Phone line selection and order confirmation
- **Transaction History** - View past purchases with reorder functionality
- **Account Management** - Manage phone lines and profile
- **Mock API** - json-server for rapid development without backend

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3
- **State**: Context API + Custom Hooks
- **Mock API**: json-server
- **Language**: JavaScript (ES6+)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
cd D-net-project

# Install dependencies
npm install

# Start development servers (both Vite and json-server)
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Mock API**: http://localhost:3001

### Demo Credentials

```
Username: demo
Password: demo
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both Vite and json-server concurrently |
| `npm run dev:vite` | Start only Vite dev server |
| `npm run dev:api` | Start only json-server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
D-net-project/
├── api/
│   └── db.json              # Mock database with 19 packages
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── domain/          # Domain-specific components
│   ├── pages/               # Route pages
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── context/             # React Context providers
│   └── utils/               # Helper functions
├── docs/                    # Documentation
├── package.json
├── tailwind.config.js
└── README.md
```

## Packages

The app includes 19 data packages across 5 categories:

| Category | Packages | Description |
|----------|----------|-------------|
| **Starter** | 4 | Light usage, 1-5GB, 7-14 days |
| **Regular** | 5 | Daily use, 5-15GB, 30 days |
| **Premium** | 5 | Heavy use, 20-50GB, 30 days |
| **Unlimited** | 3 | Unlimited with fair usage policy |
| **Special** | 2 | Weekend and Night Owl packages |

## User Journeys

### Journey 1: First Purchase
```
Login → Browse Catalog → Select Package → Checkout → Confirmation
```

### Journey 2: Reorder
```
Login → Transaction History → Reorder → Checkout → Confirmation
```

### Journey 3: Account Management
```
Login → Account → View Phone Lines → Browse Packages → Purchase
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Dummy login (demo/demo) |
| `/customers/:id` | GET | Get customer profile |
| `/phoneLines?customerId=:id` | GET | Get customer's phone lines |
| `/phoneLines` | POST | Add new phone line |
| `/packages` | GET | Get all packages |
| `/packages/:id` | GET | Get package details |
| `/transactions?customerId=:id` | GET | Get transactions |
| `/transactions` | POST | Create transaction |

## Development

### Adding New Packages

Edit `api/db.json` to add or modify packages:

```json
{
  "id": 20,
  "name": "New Package",
  "dataQuota": 10,
  "validityDays": 30,
  "price": 99999,
  "category": "regular",
  "description": "Package description",
  "features": ["Feature 1", "Feature 2"]
}
```

### Customizing Colors

Edit `tailwind.config.js` to change the color scheme:

```js
colors: {
  primary: {
    DEFAULT: '#3B82F6',  // Your primary color
    // ...
  },
  accent: {
    DEFAULT: '#10B981',  // Your accent color
    // ...
  }
}
```

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.  

## Credits

Built with:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [json-server](https://github.com/typicode/json-server)
