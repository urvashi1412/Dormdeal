import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/AppShell';

import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingPage  from './pages/ListingPage';
import CreateListing from './pages/CreateListing';
import MessagesPage from './pages/MessagesPage';
import ProfilePage  from './pages/ProfilePage';
import MyListings   from './pages/MyListings';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="dd-loading-screen">
        <div className="dd-loading-screen__inner">
          <div className="dd-spinner" />
          <span>Loading DormDeal…</span>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="dd-loading-screen">
        <div className="dd-loading-screen__inner">
          <div className="dd-spinner" />
        </div>
      </div>
    );
  }
  return user ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/"         element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/listing/:id" element={<PrivateRoute><ListingPage /></PrivateRoute>} />
        <Route path="/sell"     element={<PrivateRoute><CreateListing /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
        <Route path="/messages/:roomId" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
        <Route path="/profile"  element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
