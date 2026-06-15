import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, GitCompare, PenLine } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { StarRating } from '@/components/StarRating';
import { TagBadge } from '@/components/TagBadge';
import { ReviewItem } from '@/components/ReviewItem';
import { ReviewModal } from '@/components/ReviewModal';
import { getRatingColor, getRatingBgColor } from '@/utils/helpers';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courses = useAppStore((s) => s.courses);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) => s.isFavorite);
  const addToCompare = useAppStore((s) => s.addToCompare);
  const isInCompare = useAppStore((s) => s.isInCompare);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const course = courses.find((c) => c.id === id);
  const fav = course ? isFavorite(course.id) : false;
  const inCompare = course ? isInCompare(course.id) : false;

  useEffect(() => {
    if (searchParams.get('write') === '1' && course) {
      setReviewModalOpen(true);
    }
  }, [searchParams, course]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">课程不存在</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 text-sm">
            返回
          </button>
        </div>
      </div>
    );
  }

  const sortedReviews = [...course.reviews].sort((a, b) => (a.date < b.date ? 1 : -1));
  const ratingColor = getRatingColor(course.rating);
  const ratingBgColor = getRatingBgColor(course.rating);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-50">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 mr-8">课程详情</h1>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-5 py-6">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 bg-white/20 backdrop-blur rounded-2xl px-4 py-3 text-center min-w-[80px]">
            <div className={`text-4xl font-bold`}>
              {course.rating > 0 ? course.rating.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-white/80 mt-0.5">综合评分</div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold leading-tight">{course.name}</h2>
            <p className="text-white/80 text-sm mt-1">
              {course.teacher} · {course.college}
            </p>
            <span className="inline-block mt-2 text-xs px-2.5 py-1 bg-white/20 rounded-full">
              {course.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <StarRating value={course.rating} size={14} color="text-amber-300" readOnly />
            </div>
            <div className="text-xs text-white/80">综合推荐</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <StarRating value={course.difficulty} size={14} color="text-amber-300" readOnly />
            </div>
            <div className="text-xs text-white/80">课程难度</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <StarRating value={course.giveScore} size={14} color="text-amber-300" readOnly />
            </div>
            <div className="text-xs text-white/80">给分慷慨</div>
          </div>
        </div>
      </div>

      {course.tags.length > 0 && (
        <div className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">标签墙</h3>
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag, i) => (
              <TagBadge key={tag} text={tag} type={course.tagTypes[i]} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white mx-4 mt-4 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            全部评价 <span className="text-gray-400 font-normal">({course.reviewCount})</span>
          </h3>
        </div>

        <div className="space-y-3">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <ReviewItem key={review.id} courseId={course.id} review={review} />
            ))
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">暂无评价，快来发表第一条评价吧</div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-40">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => toggleFavorite(course.id)}
            className="flex-shrink-0 flex flex-col items-center justify-center w-14 active:scale-95 transition-transform"
          >
            <Heart
              size={22}
              className={fav ? 'text-red-500 fill-red-500' : 'text-gray-500'}
              strokeWidth={fav ? 2.5 : 2}
            />
            <span className={`text-xs mt-0.5 ${fav ? 'text-red-500' : 'text-gray-500'}`}>
              {fav ? '已收藏' : '收藏'}
            </span>
          </button>

          <button
            onClick={() => {
              if (inCompare) {
                useAppStore.getState().removeFromCompare(course.id);
                useAppStore.getState().showToast('已移出对比');
              } else {
                addToCompare(course.id);
              }
            }}
            className="flex-shrink-0 flex flex-col items-center justify-center w-14 active:scale-95 transition-transform"
          >
            <GitCompare
              size={22}
              className={inCompare ? 'text-blue-500' : 'text-gray-500'}
              strokeWidth={inCompare ? 2.5 : 2}
            />
            <span className={`text-xs mt-0.5 ${inCompare ? 'text-blue-500' : 'text-gray-500'}`}>
              {inCompare ? '已对比' : '对比'}
            </span>
          </button>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full font-medium transition-colors active:scale-[0.98]"
          >
            <PenLine size={18} />
            <span>写评价</span>
          </button>
        </div>
      </div>

      <ReviewModal
        open={reviewModalOpen}
        courseId={course.id}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
};
