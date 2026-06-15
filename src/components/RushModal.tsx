import { useEffect, useRef } from 'react';
import { Timer, Zap } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { GameCourseCard } from './GameCourseCard';
import { Course } from '@/types';

export const RushModal = () => {
  const modalData = useGameStore((s) => s.modalData);
  const rushTimeLeft = useGameStore((s) => s.currentGame?.rushTimeLeft ?? 0);
  const rushSelectCourse = useGameStore((s) => s.rushSelectCourse);
  const selectedRef = useRef(false);

  const courses: Course[] = modalData?.courses || [];

  const handleSelect = (course: Course) => {
    if (selectedRef.current) return;
    selectedRef.current = true;
    rushSelectCourse(course.id);
  };

  useEffect(() => {
    return () => {
      selectedRef.current = false;
    };
  }, []);

  if (!courses.length) return null;

  const progressWidth = (rushTimeLeft / 5) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 w-full max-w-md animate-[pulse_0.5s_ease-in-out_infinite]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap size={24} className="text-white fill-white" />
          <h3 className="text-xl font-bold text-white">限时抢课！</h3>
          <Zap size={24} className="text-white fill-white" />
        </div>

        <div className="bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-1 mb-4 text-white">
          <Timer size={18} />
          <span className="text-2xl font-bold">{rushTimeLeft}</span>
          <span className="text-sm">秒</span>
        </div>

        <div className="flex gap-2 justify-center mb-4 overflow-x-auto pb-2">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              onClick={() => handleSelect(course)}
              className="flex-shrink-0 active:scale-95 transition-transform cursor-pointer"
            >
              <GameCourseCard course={course} size="small" />
            </div>
          ))}
        </div>

        <p className="text-center text-white/90 text-sm">手快有手慢无，点击卡片抢课！</p>
      </div>
    </div>
  );
};
