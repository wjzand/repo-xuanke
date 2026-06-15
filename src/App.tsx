import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { CourseDetail } from '@/pages/CourseDetail';
import { Compare } from '@/pages/Compare';
import { Mine } from '@/pages/Mine';
import { GameHome } from '@/pages/GameHome';
import { GameBoard } from '@/pages/GameBoard';
import { GameCollection } from '@/pages/GameCollection';
import { GameRank } from '@/pages/GameRank';
import { BottomTab } from '@/components/BottomTab';
import { Toast } from '@/components/Toast';
import { useAppStore } from '@/store/useStore';

const AppContent = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/course/');
  const isGamePage = location.pathname.startsWith('/game/') && location.pathname !== '/game';

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/mine" element={<Mine />} />
        <Route path="/game" element={<GameHome />} />
        <Route path="/game/board" element={<GameBoard />} />
        <Route path="/game/collection" element={<GameCollection />} />
        <Route path="/game/rank" element={<GameRank />} />
      </Routes>
      {!isDetailPage && !isGamePage && <BottomTab />}
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
