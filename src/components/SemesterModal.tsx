import { Calendar, BookOpen, Trophy, Star } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { SelectedCourse } from '@/types';
import { getCourseCredits } from '@/data/gameData';
import { getRatingColor } from '@/utils/helpers';

export const SemesterModal = () => {
  const currentGame = useGameStore((s) => s.currentGame);
  const nextSemester = useGameStore((s) => s.nextSemester);

  if (!currentGame) return null;

  const { selectedCourses, semesterScore, currentSemester, totalSemesters, currentCredits, creditsPerSemester } =
    currentGame;

  const courseItems = selectedCourses.map((sc: SelectedCourse) => {
    const credits = getCourseCredits(sc.course);
    const baseScore = sc.course.rating * credits;
    let multiplier = 1;
    sc.eventMultipliers.forEach((m) => (multiplier *= m));
    const finalScore = Math.round(baseScore * multiplier);
    return { ...sc, baseScore, finalScore, multiplier, credits };
  });

  const totalScore = courseItems.reduce((sum, item) => sum + item.finalScore, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto animate-[fadeInUp_0.25s_ease-out]">
        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3">
            <Calendar size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            第 {currentSemester} 学期结束！
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {currentSemester < totalSemesters ? `还有 ${totalSemesters - currentSemester} 个学期就毕业啦` : '即将迎来毕业！'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentCredits}</div>
            <div className="text-xs text-blue-500">已修学分 / {creditsPerSemester}</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{selectedCourses.length}</div>
            <div className="text-xs text-emerald-500">选修课程</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{totalScore}</div>
            <div className="text-xs text-amber-500">学期体验分</div>
          </div>
        </div>

        {courseItems.length > 0 && (
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <BookOpen size={16} />
              本学期课表
            </h4>
            <div className="space-y-2">
              {courseItems.map((item) => (
                <div
                  key={item.course.id}
                  className="bg-gray-50 rounded-xl p-3 flex items-center gap-3"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center text-xl font-bold ${getRatingColor(
                      item.course.rating
                    )}`}
                  >
                    {item.course.rating.toFixed(1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {item.course.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.credits}学分 · {item.multiplier !== 1 ? `×${item.multiplier} = ` : ''}
                      <span className="font-semibold text-amber-600">{item.finalScore}分</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-5 border border-amber-100">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className="text-amber-500" />
            <span className="font-semibold text-amber-700">累计体验分</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-amber-600">
              {currentGame.totalScore + totalScore}
            </span>
            <div className="flex ml-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    (currentGame.totalScore + totalScore) / 50 >= i
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={nextSemester}
          className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold active:opacity-90 transition-opacity shadow-lg shadow-blue-200"
        >
          {currentSemester < totalSemesters ? '进入下学期 →' : '查看毕业结果 →'}
        </button>
      </div>
    </div>
  );
};
