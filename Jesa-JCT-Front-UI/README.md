# Metronic Clean Template

This is a clean Metronic React template with authentication ready for your custom application development.

## 🎯 What's Included

### Core Framework
- ✅ **Metronic Theme** - Full Metronic UI framework with all components
- ✅ **Authentication** - Azure AD authentication setup
- ✅ **Routing** - React Router DOM configured
- ✅ **State Management** - React Query (TanStack Query) setup
- ✅ **TypeScript** - Fully typed
- ✅ **Vite** - Fast build tool

### Project Structure

```
src/
├── _metronic/              # Metronic framework (DO NOT MODIFY)
│   ├── assets/            # Styles, images, fonts
│   ├── helpers/           # Utility functions
│   ├── i18n/             # Internationalization
│   ├── layout/           # Layout components (Header, Sidebar, etc.)
│   └── partials/         # Reusable Metronic components
│
├── app/                   # Your application code
│   ├── App.tsx           # Main app component
│   ├── modules/          # Feature modules
│   │   ├── auth/        # Authentication module (Azure AD)
│   │   └── errors/      # Error pages (404, 500)
│   ├── pages/           # Your custom pages
│   │   └── HomePage.tsx # Default home page
│   └── routing/         # Route configuration
│       ├── AppRoutes.tsx
│       └── PrivateRoutes.tsx
│
├── components/           # Your custom components
│   └── AzurAd/         # Azure AD integration
│
├── authConfig.ts        # Azure AD configuration
├── main.tsx            # Application entry point
└── MainStyles.tsx      # Global styles loader
```

## 🚀 Getting Started

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 📝 How to Build Your Application

### 1. Add New Pages

Create a new page in `src/app/pages/`:

```tsx
// src/app/pages/MyPage.tsx
import { FC } from 'react'

const MyPage: FC = () => {
  return (
    <div className='card'>
      <div className='card-body'>
        <h1>My Custom Page</h1>
      </div>
    </div>
  )
}

export { MyPage }
```

### 2. Add Routes

Update `src/app/routing/PrivateRoutes.tsx`:

```tsx
import { MyPage } from "../pages/MyPage";

// Add route in the Routes component
<Route path="my-page" element={<MyPage />} />
```

### 3. Add Menu Items

Update `src/_metronic/layout/components/header/MenuInner.tsx`:

```tsx
<MenuItem title="My Page" to="/my-page" />

// For submenu:
<MenuInnerWithSub
  title="My Section"
  to="/section"
  hasArrow={true}
  menuPlacement="bottom-start"
  menuTrigger={`{default:'click', lg: 'hover'}`}
>
  <MenuItem icon="abstract-26" to="/my-page" title="My Page" />
</MenuInnerWithSub>
```

### 4. Create Custom Components

Add components in `src/components/`:

```tsx
// src/components/MyComponent.tsx
import { FC } from 'react'

interface MyComponentProps {
  title: string
}

const MyComponent: FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>
}

export { MyComponent }
```

### 5. API Integration

The template includes a basic API client at `src/app/modules/auth/core/apiClient.ts`.

You can use it for API calls:

```tsx
import apiClient from '@/app/modules/auth/core/apiClient'

const fetchData = async () => {
  const response = await apiClient.get('/api/endpoint')
  return response.data
}

// With React Query
import { useQuery } from '@tanstack/react-query'

const useMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: fetchData
  })
}
```

### 6. Environment Variables

Create a `.env` file:

```env
VITE_APP_API_URL=https://your-api-url.com
VITE_APP_AZURE_CLIENT_ID=your-client-id
VITE_APP_AZURE_TENANT_ID=your-tenant-id
```

## 🎨 Metronic Components

You have access to all Metronic components:

- Cards
- Tables
- Forms
- Modals
- Buttons
- Charts (Chart.js, ApexCharts)
- Datatables
- Widgets
- And much more...

Check the [Metronic Documentation](https://preview.keenthemes.com/metronic8/react/docs) for component examples.

## 🔐 Authentication

The template uses Azure AD for authentication. Configure it in `src/authConfig.ts`:

```typescript
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_APP_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_APP_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  // ... other config
}
```

## 📚 Useful Resources

- [Metronic React Documentation](https://preview.keenthemes.com/metronic8/react/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 🛠️ Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router DOM** - Routing
- **React Query** - Data Fetching
- **Axios** - HTTP Client
- **Bootstrap 5** - CSS Framework
- **SASS** - CSS Preprocessor
- **Azure MSAL** - Authentication
- **Formik + Yup** - Form Handling & Validation

## 📄 License

This project uses Metronic theme which requires a license. Make sure you have a valid Metronic license.

## 💡 Tips

1. Keep all custom code in the `src/app` and `src/components` folders
2. Don't modify the `src/_metronic` folder directly
3. Use the existing Metronic components as much as possible
4. Follow the existing code structure and naming conventions
5. Use TypeScript types for better development experience

## 🤝 Need Help?

- Check the Metronic documentation
- Review the example components in the `_metronic` folder
- Look at the auth module for reference on how to structure features

---

**Happy Coding! 🚀**
