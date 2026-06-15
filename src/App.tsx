import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { CourseDetail } from '@/pages/CourseDetail';
import { Compare } from '@/pages/Compare';
import { Mine } from '@/pages/Mine';
import { BottomTab } from '@/components/BottomTab';
import { Toast } from '@/components/Toast';
import { useAppStore } from '@/store/useStore';

const AppContent = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/course/');

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/mine" element={<Mine />} />
      </Routes>
      {!isDetailPage && <BottomTab />}
      <Toast />
    </div>
  );
};

export default function App() {
  const initData = useAppStore((s) => s.initData);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}
