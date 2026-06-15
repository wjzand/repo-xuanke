import { Course } from '@/types';
import { getCourseRarity, getRarityBorderClass, getRarityLabel, getCourseCredits } from '@/data/gameData';
import { StarRating } from './StarRating';
import { TagBadge } from './TagBadge';
import { useGameStore } from '@/store/useGameStore';

interface GameCourseCardProps {
  course: Course;
  onSelect?: (course: Course | null) => void;
  onFlip?: () => void;
  showBack?: boolean;
  size?: 'small' | 'normal';
  selected?: boolean;
}

export const GameCourseCard = ({
  course,
  onSelect,
  showBack,
  size = 'normal',
  selected,
}: GameCourseCardProps) => {
  const toggleCardBack = useGameStore((s) => s.toggleCardBack);
  const showCardBack = useGameStore((s) => s.currentGame?.showCardBack?.[course.id] ?? false);
  const isBack = showBack !== undefined ? showBack : showCardBack;

  const rarity = getCourseRarity(course);
  const rarityInfo = getRarityLabel(rarity);
  const borderClass = getRarityBorderClass(rarity);
  const credits = getCourseCredits(course);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCardBack(course.id);
  };

  const cardSizeClass = size === 'small' ? 'w-full max-w-[140px]' : 'w-full max-w-[280px]';

  return (
    <div
      className={`${cardSizeClass} cursor-pointer perspective-1000`}
      onClick={() => onSelect && onSelect(course)}
    >
      <div
        className={`relative w-full transition-transform duration-500 preserve-3d ${
          isBack ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`w-full rounded-xl bg-white p-3 ${borderClass} ${
            selected ? 'ring-4 ring-blue-400 shadow-lg shadow-blue-200' : ''
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-bold text-gray-900 ${size === 'small' ? 'text-sm' : 'text-base'}`}>
                {course.name}
              </h3>
              <p className={`text-gray-500 ${size === 'small' ? 'text-xs' : 'text-xs'} mt-0.5`}>
                {course.teacher}
              </p>
            </div>
            <div
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                rarity === 'legendary'
                  ? 'bg-amber-100 text-amber-700'
                  : rarity === 'good'
                  ? 'bg-emerald-100 text-emerald-700'
                  : rarity === 'trap'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {rarityInfo.label}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-2">
            <div className="text-center">
              <div className={`font-bold ${rarityInfo.color}`}>{course.rating.toFixed(1)}</div>
              <div className="text-[10px] text-gray-400">综合</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <StarRating value={course.difficulty} size={10} readOnly />
              </div>
              <div className="text-[10px] text-gray-400">难度</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <StarRating value={course.giveScore} size={10} readOnly />
              </div>
              <div className="text-[10px] text-gray-400">给分</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">学分: {credits}</span>
            <button
              onClick={handleFlip}
              className="text-blue-500 hover:text-blue-600 active:scale-95 transition-transform"
            >
              查看详情 →
            </button>
          </div>

          {size !== 'small' && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-50">
              {course.tags.slice(0, 3).map((tag, i) => (
                <TagBadge key={tag} text={tag} type={course.tagTypes[i]} small />
              ))}
            </div>
          )}
        </div>

        <div
          className={`absolute inset-0 w-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 ${borderClass}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h3 className="font-bold text-white mb-2">{course.name}</h3>
          <div className="text-xs text-white/90 mb-3">
            {course.reviews.length > 0 && course.reviews[0].content}
          </div>
          <div className="text-xs text-white/80 mb-2">
            {course.rating >= 4.0
              ? '✅ 选课建议：强烈推荐，神仙课别错过！'
              : course.rating >= 3.0
              ? '⚠️ 选课建议：可以考虑，根据自身情况决定'
              : '❌ 选课建议：谨慎选择，小心踩坑！'}
          </div>
          <button
            onClick={handleFlip}
            className="absolute bottom-3 right-3 text-white/80 hover:text-white text-xs active:scale-95 transition-transform"
          >
            ← 返回
          </button>
        </div>
      </div>
    </div>
  );
};
