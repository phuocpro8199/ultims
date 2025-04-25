import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/InitRouter';
import ErrorBoundary from '@sharedComponents/ErrorBoundary';
import '@/app.css';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </ErrorBoundary>
  );
}

export default App;
