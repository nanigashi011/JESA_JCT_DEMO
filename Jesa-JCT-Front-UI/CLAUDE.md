# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start Vite dev server at localhost:3000
npm run build    # Production build (outputs to dist/)
npm run lint     # ESLint with TypeScript (strict: max-warnings 0)
npm run preview  # Preview production build
```

## Architecture

This is a React 18 + TypeScript dashboard application built on the **Metronic theme framework**. It uses Vite for builds with React SWC plugin.

### Key Technology Stack
- **State**: Zustand (client) + TanStack React Query (server)
- **Routing**: React Router DOM 6
- **HTTP**: Axios with auth interceptors (`src/app/modules/auth/core/apiClient.ts`)
- **Styling**: Bootstrap 5 + SASS
- **Drag & Drop**: dnd-kit for widget reordering

### Path Alias
`@/` maps to `src/` (configured in vite.config.ts and tsconfig.json)

### API Proxy
Dev server proxies `/api` requests to `http://localhost:5106`

## Code Organization

```
src/
├── _metronic/           # Theme framework - DO NOT MODIFY
│   ├── layout/          # MasterLayout, Header, Sidebar
│   └── partials/        # Reusable UI components
├── app/
│   ├── modules/
│   │   ├── auth/        # Auth context, login, apiClient
│   │   └── errors/      # 404, 500 pages
│   ├── pages/
│   │   ├── home/        # Dashboard with draggable widgets
│   │   └── reality/     # CCTV, Drone, 3D viewer pages
│   └── routing/         # AppRoutes, PrivateRoutes
└── main.tsx             # Entry: QueryClient, Auth, i18n providers
```

### Dashboard Widget System
The home page (`src/app/pages/home/`) uses a drag-and-drop widget system:
- Widgets: myActions, supportRequest, applications, alertsByType, alertsByCategory, reality
- Widget order persists per user in localStorage
- Uses `useUserWidgets` hook and `SortableWidget` component with dnd-kit

### Authentication
- Auth state stored in localStorage key `kt-auth-react-v`
- apiClient automatically attaches Bearer token and handles 401 redirects
- Azure AD integration available via MSAL (optional)

### Adding New Pages
1. Create page component in `src/app/pages/`
2. Add route in `src/app/routing/PrivateRoutes.tsx`
3. Add menu item in `src/_metronic/layout/components/header/MenuInner.tsx`

### Adding API Calls
```tsx
import apiClient from '@/app/modules/auth/core/apiClient'
import { useQuery } from '@tanstack/react-query'

const useMyData = () => useQuery({
  queryKey: ['myData'],
  queryFn: () => apiClient.get('/api/endpoint').then(r => r.data)
})
```

## Environment Variables

Prefix with `VITE_APP_` for client access:
- `VITE_APP_API_URL` - Backend API base URL
- `VITE_APP_AZURE_CLIENT_ID` - Azure AD client ID
- `VITE_APP_AZURE_TENANT_ID` - Azure AD tenant ID

## Deployment

Docker multi-stage build: Node 18 builder → Nginx server (see Dockerfile, nginx.conf)
Deployed via GitHub Actions to Azure Web App with Azure Container Registry.
