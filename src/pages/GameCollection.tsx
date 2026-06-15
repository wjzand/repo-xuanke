import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useStore';
import { GameCourseCard } from '@/components/GameCourseCard';
import { Course } from '@/types';

export const GameCollection = () => {
  const navigate = useNavigate();
  const getCollectedCourses = useGameStore((s) => s.getCollectedCourses);
  const initGameStore = useGameStore((s) => s.init);
  const allCourses = useAppStore((s) => s.courses);

  const [collected, setCollected] = useState<Course[]>([]);

  useEffect(() => {
    initGameStore();
    (window as any).__COURSES__ = { courses: allCourses };
    setCollected(getCollectedCourses());
  }, [allCourses]);

  const collectedIds = collected.map((c) => c.id);
  const uncollected = allCourses.filter((c) => !collectedIds.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 pb-24">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 mr-8">课程图鉴</h1>
        </div>
      </div>

      <div className="px-4 pt-6 text-center text-white">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
          <BookOpen size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold">
          已收集 {collected.length} / {allCourses.length}
        </h2>
        <p className="text-white/80 text-sm mt-1">在游戏中选课自动解锁图鉴</p>

        <div className="mt-4 bg-white/20 backdrop-blur rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${(collected.length / allCourses.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-4 mt-6">
        {collected.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-emerald-300">✨</span>
              已解锁 ({collected.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {collected.map((course) => (
                <GameCourseCard key={course.id} course={course} size="small" />
              ))}
            </div>
          </div>
        )}

        {uncollected.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Lock size={16} className="text-white/60" />
              未解锁 ({uncollected.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {uncollected.map((course) => (
                <div
                  key={course.id}
                  className="relative rounded-xl bg-white/10 backdrop-blur overflow-hidden"
                >
                  <div className="blur-sm">
                    <GameCourseCard course={course} size="small" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Lock size={28} className="text-white/80" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
