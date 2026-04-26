import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  const { initAuthListener } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Initialize theme
    document.documentElement.setAttribute('data-theme', theme);

    // Set up Firebase auth state listener
    const unsubscribe = initAuthListener();

    return () => unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: 'white',
            },
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
