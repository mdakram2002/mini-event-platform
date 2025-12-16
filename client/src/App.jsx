import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';
import NotFound from './pages/NotFound';

function App() {
  console.log('App is rendering');
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container-responsive py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/my-events" element={
                  <ProtectedRoute>
                    <MyEvents />
                  </ProtectedRoute>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;