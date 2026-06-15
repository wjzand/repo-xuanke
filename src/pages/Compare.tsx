import { useNavigate } from 'react-router-dom';
import { X, GitCompare } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { StarRating } from '@/components/StarRating';
import { TagBadge } from '@/components/TagBadge';
import { getRatingColor } from '@/utils/helpers';

export const Compare = () => {
  const navigate = useNavigate();
  const courses = useAppStore((s) => s.courses);
  const compareList = useAppStore((s) => s.userData.compareList);
  const removeFromCompare = useAppStore((s) => s.removeFromCompare);

  const compareCourses = compareList
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean) as any[];

  const rows = [
    { label: '综合评分', key: 'rating', type: 'score' },
    { label: '难度', key: 'difficulty', type: 'star' },
    { label: '给分慷慨度', key: 'giveScore', type: 'star' },
    { label: '评价数量', key: 'reviewCount', type: 'text' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-2xl font-bold text-gray-900">课程对比</h1>
          <p className="text-sm text-gray-500 mt-1">横向对比，帮你做出更好选择</p>
        </div>
      </div>

      {compareCourses.length === 0 ? (
        <div className="px-4">
          <div className="py-20 text-center bg-white rounded-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <GitCompare size={36} className="text-blue-400" />
            </div>
            <p className="text-gray-500 text-sm">还没有添加对比课程</p>
            <p className="text-gray-400 text-xs mt-1">在课程列表中点击 ⊕ 添加</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium active:scale-95 transition-transform"
            >
              去选课广场看看
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white z-10 w-28 text-left px-4 py-4 text-xs font-medium text-gray-500 border-b border-gray-50">
                      对比项
                    </th>
                    {compareCourses.map((course) => (
                      <th key={course.id} className="px-4 py-4 text-center border-b border-gray-50 min-w-[140px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(course.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="text-left"
                          >
                            <div className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                              {course.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{course.teacher}</div>
                          </button>
                        </div>
                      </th>
                    ))}
                    {compareCourses.length < 3 && (
                      <th className="px-4 py-4 text-center border-b border-gray-50 min-w-[140px]">
                        <button
                          onClick={() => navigate('/')}
                          className="w-full h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors"
                        >
                          <span className="text-2xl leading-none">+</span>
                          <span className="text-xs mt-1">添加课程</span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b border-gray-50 last:border-b-0">
                      <td className="sticky left-0 bg-white z-10 px-4 py-4 text-sm text-gray-500 font-medium">
                        {row.label}
                      </td>
                      {compareCourses.map((course) => (
                        <td key={course.id} className="px-4 py-4 text-center">
                          {row.type === 'score' && (
                            <span className={`text-2xl font-bold ${getRatingColor(course[row.key])}`}>
                              {course[row.key].toFixed(1)}
                            </span>
                          )}
                          {row.type === 'star' && (
                            <div className="flex justify-center">
                              <StarRating value={course[row.key]} size={16} readOnly />
                            </div>
                          )}
                          {row.type === 'text' && (
                            <span className="text-gray-700 font-medium">{course[row.key]}条</span>
                          )}
                        </td>
                      ))}
                      {compareCourses.length < 3 && <td className="px-4 py-4" />}
                    </tr>
                  ))}
                  <tr>
                    <td className="sticky left-0 bg-white z-10 px-4 py-4 text-sm text-gray-500 font-medium align-top">
                      关键标签
                    </td>
                    {compareCourses.map((course) => (
                      <td key={course.id} className="px-4 py-4 align-top">
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {course.tags.slice(0, 4).map((tag: string, i: number) => (
                            <TagBadge key={tag} text={tag} type={course.tagTypes[i]} small />
                          ))}
                        </div>
                      </td>
                    ))}
                    {compareCourses.length < 3 && <td className="px-4 py-4" />}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400 text-center">最多可对比3门课程</div>
        </div>
      )}
    </div>
  );
};
