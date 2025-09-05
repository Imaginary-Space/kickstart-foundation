import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PostHogProvider } from 'posthog-js/react'
import Hotjar from '@hotjar/browser'

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
}

// Initialize Hotjar
const siteId = 6512757;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
      <App />
    </PostHogProvider>
  </StrictMode>,
);
