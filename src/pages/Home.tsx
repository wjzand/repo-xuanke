import { Search } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { CourseCard } from '@/components/CourseCard';
import { filterCourses } from '@/utils/helpers';
import { FilterType } from '@/types';

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'top', label: '评分最高' },
  { key: 'easy', label: '轻松好过' },
  { key: 'generous', label: '给分大方' },
  { key: 'warning', label: '避坑警告' },
];

export const Home = () => {
  const courses = useAppStore((s) => s.courses);
  const activeFilter = useAppStore((s) => s.activeFilter);
  const searchKeyword = useAppStore((s) => s.searchKeyword);
  const setActiveFilter = useAppStore((s) => s.setActiveFilter);
  const setSearchKeyword = useAppStore((s) => s.setSearchKeyword);

  const filteredCourses = filterCourses(courses, activeFilter, searchKeyword);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">选课广场</h1>
          <p className="text-sm text-gray-500 mt-1">看看学长学姐的真实评价</p>
        </div>

        <div className="px-4 py-2">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索课程名、教师、学院"
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm placeholder-gray-400 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  activeFilter === f.key
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                    : 'bg-white text-gray-600 border border-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-2 space-y-3">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
        ) : (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-sm">没有找到匹配的课程</p>
            <p className="text-gray-400 text-xs mt-1">试试更换筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
};
