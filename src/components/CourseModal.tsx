import { X } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { GameCourseCard } from './GameCourseCard';
import { Course } from '@/types';

export const CourseModal = () => {
  const modalData = useGameStore((s) => s.modalData);
  const selectCourse = useGameStore((s) => s.selectCourse);
  const closeModal = useGameStore((s) => s.closeModal);

  if (!modalData?.course) return null;
  const course: Course = modalData.course;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm animate-[fadeInUp_0.25s_ease-out]">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-1">发现一门课程！</h3>
        <p className="text-sm text-gray-500 mb-4">是否要选择这门课？</p>

        <div className="flex justify-center mb-5">
          <GameCourseCard course={course} size="normal" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => selectCourse(null)}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-medium active:bg-gray-50 transition-colors"
          >
            跳过
          </button>
          <button
            onClick={() => selectCourse(course)}
            className="flex-1 py-3 bg-blue-500 text-white rounded-full font-medium active:bg-blue-600 transition-colors"
          >
            选这门课
          </button>
        </div>
      </div>
    </div>
  );
};
