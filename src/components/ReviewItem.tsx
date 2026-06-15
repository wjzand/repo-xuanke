import { Heart } from 'lucide-react';
import { Review } from '@/types';
import { useAppStore } from '@/store/useStore';
import { StarRating } from './StarRating';
import { TagBadge } from './TagBadge';
import { getTagType, formatDate } from '@/utils/helpers';

interface ReviewItemProps {
  courseId: string;
  review: Review;
}

export const ReviewItem = ({ courseId, review }: ReviewItemProps) => {
  const toggleLike = useAppStore((s) => s.toggleLike);

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {review.author.slice(-1)}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{review.author}</div>
            <div className="text-xs text-gray-400 mt-0.5">{formatDate(review.date)}</div>
          </div>
        </div>
        <button
          onClick={() => toggleLike(courseId, review.id)}
          className="flex items-center gap-1 py-1 px-2 rounded-full active:scale-95 transition-transform"
        >
          <Heart
            size={16}
            className={review.liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}
          />
          <span className={`text-xs ${review.liked ? 'text-red-500' : 'text-gray-400'}`}>
            {review.likes}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div>
          <div className="text-xs text-gray-400 mb-1">综合</div>
          <StarRating value={review.rating} size={14} readOnly />
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">难度</div>
          <StarRating value={review.difficulty} size={14} readOnly />
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">给分</div>
          <StarRating value={review.giveScore} size={14} readOnly />
        </div>
      </div>

      <p className="text-sm text-gray-700 mt-3 leading-relaxed">{review.content}</p>

      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {review.tags.map((tag) => (
            <TagBadge key={tag} text={tag} type={getTagType(tag) as any} small />
          ))}
        </div>
      )}
    </div>
  );
};
