import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, PenLine, ChevronRight } from 'lucide-react';
import { Course } from '@/types';
import { useAppStore } from '@/store/useStore';
import { getRatingColor } from '@/utils/helpers';
import { StarRating } from './StarRating';
import { TagBadge } from './TagBadge';

interface CourseCardProps {
  course: Course;
  showActions?: boolean;
}

export const CourseCard = ({ course, showActions = true }: CourseCardProps) => {
  const navigate = useNavigate();
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) => s.isFavorite);
  const addToCompare = useAppStore((s) => s.addToCompare);
  const removeFromCompare = useAppStore((s) => s.removeFromCompare);
  const isInCompare = useAppStore((s) => s.isInCompare);

  const fav = isFavorite(course.id);
  const inCompare = isInCompare(course.id);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(course.id);
    } else {
      addToCompare(course.id);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(course.id);
  };

  const handleWriteReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/course/${course.id}?write=1`);
  };

  const ratingColor = getRatingColor(course.rating);

  return (
    <div
      onClick={() => navigate(`/course/${course.id}`)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[60px]">
          <span className={`text-3xl font-bold ${ratingColor}`}>
            {course.rating > 0 ? course.rating.toFixed(1) : '--'}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">综合评分</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base truncate">{course.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {course.teacher} · {course.college}
              </p>
            </div>
            <span
              className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                course.category === '必修'
                  ? 'bg-red-50 text-red-500'
                  : course.category === '选修'
                  ? 'bg-blue-50 text-blue-500'
                  : 'bg-emerald-50 text-emerald-500'
              }`}
            >
              {course.category}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap">难度</span>
              <StarRating value={course.difficulty} size={12} readOnly />
            </div>
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap">给分</span>
              <StarRating value={course.giveScore} size={12} readOnly />
            </div>
            <span>{course.reviewCount}条评价</span>
          </div>

          {course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {course.tags.slice(0, 3).map((tag, i) => (
                <TagBadge key={tag} text={tag} type={course.tagTypes[i]} small />
              ))}
            </div>
          )}
        </div>

        <ChevronRight size={18} className="flex-shrink-0 text-gray-300 self-center" />
      </div>

      {showActions && (
        <div className="flex items-center justify-around pt-3 mt-3 border-t border-gray-50">
          <button
            onClick={handleFavorite}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-sm transition-all active:scale-95"
          >
            <Heart
              size={18}
              className={fav ? 'text-red-500 fill-red-500' : 'text-gray-400'}
              strokeWidth={fav ? 2.5 : 2}
            />
            <span className={fav ? 'text-red-500' : 'text-gray-500'}>{fav ? '已收藏' : '收藏'}</span>
          </button>

          <button
            onClick={handleCompareToggle}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-sm transition-all active:scale-95"
          >
            {inCompare ? (
              <Minus size={18} className="text-blue-500" strokeWidth={2.5} />
            ) : (
              <Plus size={18} className="text-gray-400" strokeWidth={2} />
            )}
            <span className={inCompare ? 'text-blue-500' : 'text-gray-500'}>
              {inCompare ? '移出对比' : '加入对比'}
            </span>
          </button>

          <button
            onClick={handleWriteReview}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-sm text-blue-500 transition-all active:scale-95"
          >
            <PenLine size={18} strokeWidth={2} />
            <span>写评价</span>
          </button>
        </div>
      )}
    </div>
  );
};
