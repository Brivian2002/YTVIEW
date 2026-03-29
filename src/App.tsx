import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/stores';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import ChannelAnalyzer from '@/pages/ChannelAnalyzer';
import VideoAnalyzer from '@/pages/VideoAnalyzer';
import ThumbnailLab from '@/pages/ThumbnailLab';
import SEOStudio from '@/pages/SEOStudio';
import TranscriptLab from '@/pages/TranscriptLab';
import Trending from '@/pages/Trending';
import RevenueTools from '@/pages/RevenueTools';
import Settings from '@/pages/Settings';
import Billing from '@/pages/Billing';
import Admin from '@/pages/Admin';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children, requiredPlan = 'free' }: { children: React.ReactNode; requiredPlan?: 'free' | 'pro' | 'premium' }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const planHierarchy = { free: 0, pro: 1, premium: 2 };
  const userPlanLevel = planHierarchy[user?.plan || 'free'];
  const requiredPlanLevel = planHierarchy[requiredPlan];
  
  if (userPlanLevel < requiredPlanLevel) {
    return <Navigate to="/pricing" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/channel-analyzer" element={<ChannelAnalyzer />} />
            <Route path="/video-analyzer" element={<VideoAnalyzer />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/billing" element={<Billing />} />
          </Route>

          {/* Pro Routes */}
          <Route element={
            <ProtectedRoute requiredPlan="pro">
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/thumbnail-lab" element={<ThumbnailLab />} />
            <Route path="/seo-studio" element={<SEOStudio />} />
            <Route path="/transcript-lab" element={<TranscriptLab />} />
            <Route path="/revenue-tools" element={<RevenueTools />} />
          </Route>

          {/* Admin Routes */}
          <Route element={
            <ProtectedRoute requiredPlan="premium">
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
