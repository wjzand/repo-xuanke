import { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { GameCourseCard } from './GameCourseCard';
import { SelectedCourse, Course } from '@/types';

export const TradeModal = () => {
  const modalData = useGameStore((s) => s.modalData);
  const tradeCourse = useGameStore((s) => s.tradeCourse);
  const closeModal = useGameStore((s) => s.closeModal);

  const [selectedDropId, setSelectedDropId] = useState<string | null>(null);

  const selectedCourses: SelectedCourse[] = modalData?.selectedCourses || [];
  const newCourse: Course | null = modalData?.newCourse || null;

  if (!newCourse) return null;

  const handleTrade = () => {
    if (selectedCourses.length === 0) {
      tradeCourse(null, null);
    } else if (selectedDropId) {
      tradeCourse(selectedDropId, newCourse);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative bg-white rounded-2xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto animate-[fadeInUp_0.25s_ease-out]">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <RefreshCw size={22} className="text-pink-500" />
          <h3 className="text-lg font-bold text-gray-900">课程交易站</h3>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 text-center mb-3">系统为你准备了一门新课：</p>
          <div className="flex justify-center">
            <GameCourseCard course={newCourse} size="small" />
          </div>
        </div>

        {selectedCourses.length > 0 ? (
          <>
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-sm text-gray-500 mb-3">选择一门你想换掉的课：</p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {selectedCourses.map((sc) => (
                  <div
                    key={sc.course.id}
                    onClick={() => setSelectedDropId(sc.course.id)}
                    className="cursor-pointer"
                  >
                    <GameCourseCard
                      course={sc.course}
                      size="small"
                      selected={selectedDropId === sc.course.id}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => tradeCourse(null, null)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-medium active:bg-gray-50 transition-colors"
              >
                不换了
              </button>
              <button
                onClick={handleTrade}
                disabled={!selectedDropId}
                className="flex-1 py-3 bg-pink-500 text-white rounded-full font-medium active:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                完成交易
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => tradeCourse(null, newCourse)}
            className="w-full py-3 bg-pink-500 text-white rounded-full font-medium active:bg-pink-600 transition-colors"
          >
            直接收下这门课
          </button>
        )}
      </div>
    </div>
  );
};
