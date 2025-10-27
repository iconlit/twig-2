
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <AppRoutes />
            </main>
          </div>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
